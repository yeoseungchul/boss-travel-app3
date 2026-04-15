"use server";

import { headers } from "next/headers";
import { assertInquiryRateLimit } from "@/lib/inquiry-rate-limit";
import {
  cleanEnv,
  createServerSupabaseClient,
  createServiceRoleSupabaseClient,
  getSupabasePublicEnv,
} from "@/lib/supabase";

export type SubmitInquiryDebug = {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
};

export type SubmitInquiryResult =
  | { ok: true; id: string | null; received_at: string }
  | {
      ok: false;
      error: string;
      code?: string;
      hint?: "env" | "table" | "generic" | "rate_limit";
      retryAfterSec?: number;
      debug?: SubmitInquiryDebug;
    };

function n8nInquiryWebhookUrl(): string {
  return (
    cleanEnv(process.env.N8N_INQUIRY_WEBHOOK_URL) ||
    cleanEnv(process.env.NEXT_PUBLIC_N8N_INQUIRY_WEBHOOK_URL)
  );
}

function rpcMissingMessage(msg: string | undefined, code: string | undefined): boolean {
  if (code === "PGRST202" || code === "42883") return true;
  const m = (msg ?? "").toLowerCase();
  return (
    m.includes("could not find the function") ||
    m.includes("function public.submit_inquiry") ||
    m.includes("submit_inquiry") && m.includes("does not exist")
  );
}

export async function submitInquiry(input: {
  name: string;
  phone: string;
  product_id: string | null;
  product_label: string | null;
  message: string;
  travel_date: string;
  guests: number;
  locale: string;
}): Promise<SubmitInquiryResult> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const clientIp = (forwarded?.split(",")[0] ?? h.get("x-real-ip") ?? "anon").trim() || "anon";
  const gate = assertInquiryRateLimit(clientIp);
  if (!gate.ok) {
    return {
      ok: false,
      error: "Too many requests",
      code: "rate_limit",
      hint: "rate_limit",
      retryAfterSec: gate.retryAfterSec,
    };
  }

  const env = getSupabasePublicEnv();
  if (!env) {
    return {
      ok: false,
      error:
        "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local — no quotes or spaces around values.",
      code: "env_missing",
      hint: "env",
      debug: {
        message: "env_missing",
        details: "getSupabasePublicEnv() returned null after cleaning env strings.",
      },
    };
  }

  const name = input.name.trim();
  const phone = input.phone.trim();
  const product_id = (input.product_id ?? "").trim() || null;
  const product_label = (input.product_label ?? "").trim() || null;
  const message = input.message.trim();

  if (!name || !phone || !input.travel_date || !message) {
    return {
      ok: false,
      error: "Required fields are empty.",
      code: "validation",
      debug: { message: "validation", details: "name, phone, travel_date, or message empty" },
    };
  }

  const guests = Math.min(30, Math.max(1, Math.floor(Number(input.guests)) || 1));
  const locale = input.locale.trim();
  const row = {
    name,
    phone,
    product_id,
    product_label,
    message,
    travel_date: input.travel_date,
    guests,
    locale,
  };

  function isMissingColumnError(code: string | null | undefined, msg: string | undefined) {
    if (code === "PGRST204") return true;
    const m = (msg ?? "").toLowerCase();
    return m.includes("could not find the") && m.includes("column");
  }

  function stripOptionalColumns<T extends Record<string, unknown>>(r: T) {
    const { product_id: _pid, product_label: _pl, message: _m, ...rest } = r as T & {
      product_id?: unknown;
      product_label?: unknown;
      message?: unknown;
    };
    void _pid;
    void _pl;
    void _m;
    return rest;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const service = createServiceRoleSupabaseClient();

    let inquiryId: string | null = null;

    if (service) {
      let { data, error } = await service.from("inquiries").insert(row).select("id").single();
      if (error && isMissingColumnError(error.code, error.message)) {
        console.warn("[submitInquiry] Missing optional columns; retrying insert without product/message fields.");
        ({ data, error } = await service.from("inquiries").insert(stripOptionalColumns(row)).select("id").single());
      }
      if (error) {
        console.error("[submitInquiry] Supabase error:", error.message, error.code, error.details, error.hint);
        const msg = error.message.toLowerCase();
        const noTable =
          error.code === "PGRST205" ||
          error.code === "42P01" ||
          msg.includes("could not find the table") ||
          (msg.includes("relation") && msg.includes("does not exist"));
        const rls =
          msg.includes("row-level security") ||
          msg.includes("violates row-level security") ||
          error.code === "42501";
        return {
          ok: false,
          error: error.message,
          code: error.code ?? "supabase",
          hint: noTable ? "table" : rls ? "generic" : "generic",
          debug: {
            message: error.message,
            details: error.details ?? null,
            hint: error.hint ?? null,
            code: error.code ?? null,
          },
        };
      }
      inquiryId = data?.id ?? null;
    } else {
      const { data: rpcId, error: rpcError } = await supabase.rpc("submit_inquiry", {
        p_name: name,
        p_phone: phone,
        p_product_id: product_id,
        p_product_label: product_label,
        p_message: message,
        p_travel_date: input.travel_date,
        p_guests: guests,
        p_locale: locale,
      });

      if (!rpcError && rpcId != null) {
        inquiryId = typeof rpcId === "string" ? rpcId : String(rpcId);
      } else if (rpcError && rpcMissingMessage(rpcError.message, rpcError.code ?? undefined)) {
        // Fallback: direct insert (RLS allows INSERT, but may not allow returning id).
        let { error: insErr } = await supabase.from("inquiries").insert(row);
        if (insErr && isMissingColumnError(insErr.code, insErr.message)) {
          console.warn("[submitInquiry] Missing optional columns; retrying insert without product/message fields.");
          ({ error: insErr } = await supabase.from("inquiries").insert(stripOptionalColumns(row)));
        }
        if (insErr) {
          console.error("[submitInquiry] Supabase error:", insErr.message, insErr.code, insErr.details, insErr.hint);
          const msg = insErr.message.toLowerCase();
          const noTable =
            insErr.code === "PGRST205" ||
            insErr.code === "42P01" ||
            msg.includes("could not find the table") ||
            (msg.includes("relation") && msg.includes("does not exist"));
          const rls =
            msg.includes("row-level security") ||
            msg.includes("violates row-level security") ||
            insErr.code === "42501";
          return {
            ok: false,
            error: insErr.message,
            code: insErr.code ?? "supabase",
            hint: noTable ? "table" : rls ? "generic" : "generic",
            debug: {
              message: insErr.message,
              details: insErr.details ?? null,
              hint: insErr.hint ?? null,
              code: insErr.code ?? null,
            },
          };
        }
        console.warn(
          "[submitInquiry] Row saved but id unknown. Run the submit_inquiry function from supabase/sql/inquiries.sql in the SQL editor, or set SUPABASE_SERVICE_ROLE_KEY for insert+return.",
        );
        inquiryId = null;
      } else if (rpcError) {
        console.error("[submitInquiry] RPC error:", rpcError.message, rpcError.code, rpcError.details, rpcError.hint);
        const msg = rpcError.message.toLowerCase();
        const noTable =
          rpcError.code === "PGRST205" ||
          rpcError.code === "42P01" ||
          msg.includes("could not find the table") ||
          (msg.includes("relation") && msg.includes("does not exist"));
        const rls =
          msg.includes("row-level security") ||
          msg.includes("violates row-level security") ||
          rpcError.code === "42501";
        return {
          ok: false,
          error: rpcError.message,
          code: rpcError.code ?? "supabase",
          hint: noTable ? "table" : rls ? "generic" : "generic",
          debug: {
            message: rpcError.message,
            details: rpcError.details ?? null,
            hint: rpcError.hint ?? null,
            code: rpcError.code ?? null,
          },
        };
      } else {
        console.warn("[submitInquiry] submit_inquiry returned unexpected payload:", rpcId);
        inquiryId = null;
      }
    }

    const received_at = new Date().toISOString();
    const webhookUrl = n8nInquiryWebhookUrl();

    if (webhookUrl) {
      const payload = {
        id: inquiryId,
        name,
        phone,
        product_id,
        product_label,
        message,
        travel_date: input.travel_date,
        guests,
        locale,
        received_at,
      };
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.warn("[submitInquiry] n8n webhook HTTP", res.status, await res.text().catch(() => ""));
        }
      } catch (e) {
        console.warn("[submitInquiry] n8n webhook failed (inquiry still saved):", e);
      }
    }

    return { ok: true, id: inquiryId, received_at };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    const stack = e instanceof Error ? e.stack : undefined;
    console.error("[submitInquiry]", e);
    return {
      ok: false,
      error: message,
      code: "exception",
      debug: { message, details: stack ?? null },
    };
  }
}
