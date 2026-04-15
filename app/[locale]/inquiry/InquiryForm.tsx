"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { routing } from "@/i18n/routing";
import { PRODUCTS } from "@/lib/products";
import { submitInquiry } from "./actions";

function isSubmitResult(v: unknown): v is Awaited<ReturnType<typeof submitInquiry>> {
  return typeof v === "object" && v !== null && "ok" in v && typeof (v as { ok: unknown }).ok === "boolean";
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin text-navy-950"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
      />
    </svg>
  );
}

export function InquiryForm({
  preselectedProductId = "",
  prefillDepositIntent = false,
}: {
  preselectedProductId?: string;
  prefillDepositIntent?: boolean;
}) {
  void prefillDepositIntent;
  const t = useTranslations("Inquiry");
  const tProducts = useTranslations("Products");
  const localeFromIntl = useLocale();
  const locale =
    typeof localeFromIntl === "string" && routing.locales.includes(localeFromIntl as (typeof routing.locales)[number])
      ? localeFromIntl
      : routing.defaultLocale;
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [productId, setProductId] = useState(preselectedProductId.trim());
  const productLabel = useMemo(() => {
    const p = PRODUCTS.find((x) => x.id === productId);
    return p ? tProducts(`${p.messageKey}.name`) : "";
  }, [productId, tProducts]);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function closeDialog() {
    dialogRef.current?.close();
    setName("");
    setPhone("");
    setProductId(preselectedProductId.trim());
    setMessage("");
    setDate("");
    setGuests("2");
    setSubmitError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    startTransition(() => {
      void (async () => {
        try {
          const guestsParsed = Number.parseInt(guests, 10);
          const result = await submitInquiry({
            name,
            phone,
            product_id: productId || null,
            product_label: productId ? productLabel : null,
            message,
            travel_date: date,
            guests: Number.isFinite(guestsParsed) ? guestsParsed : 2,
            locale,
          });

          if (!isSubmitResult(result)) {
            console.error("[InquiryForm] unexpected submitInquiry response:", result);
            setSubmitError(t("submitError"));
            return;
          }

          if (result.ok) {
            dialogRef.current?.showModal();
            return;
          }

          console.log("[InquiryForm] submitInquiry failed — full result:", result);
          if (result.debug) {
            console.log("[InquiryForm] Supabase / server debug:", result.debug);
          }

          if (result.hint === "env") {
            setSubmitError(t("submitErrorConfig"));
            return;
          }
          if (result.hint === "table") {
            setSubmitError(t("submitErrorTable"));
            return;
          }
          if (result.hint === "rate_limit" && typeof result.retryAfterSec === "number") {
            setSubmitError(t("submitErrorRateLimit", { seconds: result.retryAfterSec }));
            return;
          }
          setSubmitError(result.error ? `${t("submitError")}\n\n${result.error}` : t("submitError"));
        } catch (err) {
          console.error("[InquiryForm] submit threw:", err);
          setSubmitError(t("submitError"));
        }
      })();
    });
  }

  return (
    <>
      {submitError && (
        <div
          role="alert"
          className="whitespace-pre-wrap rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-100"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="locale" value={locale} readOnly aria-hidden tabIndex={-1} />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("product")}</span>
          <select
            name="product_id"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={isPending}
            className="min-h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 text-lg text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
          >
            <option value="">{t("productNone")}</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {tProducts(`${p.messageKey}.name`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("name")}</span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            disabled={isPending}
            className="min-h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 text-lg text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("phone")}</span>
          <input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            inputMode="tel"
            disabled={isPending}
            className="min-h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 text-lg text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("message")}</span>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            disabled={isPending}
            className="resize-none rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-4 text-base leading-relaxed text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
            placeholder={t("messagePlaceholder")}
          />
          <span className="text-xs text-white/40">{t("messageHint")}</span>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("date")}</span>
          <input
            name="travel_date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isPending}
            className="min-h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 text-lg text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">{t("guests")}</span>
          <input
            name="guests"
            type="number"
            min={1}
            max={30}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            inputMode="numeric"
            disabled={isPending}
            className="min-h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 text-lg text-white outline-none transition focus:border-boss-accent/50 focus:ring-2 focus:ring-boss-accent/40 disabled:opacity-50"
          />
          <span className="text-xs text-white/40">{t("guestsHint")}</span>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex min-h-16 items-center justify-center rounded-2xl bg-boss-accent text-lg font-semibold text-navy-950 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-3">
              <Spinner />
              {t("sending")}
            </span>
          ) : (
            t("submit")
          )}
        </button>
      </form>

      <dialog
        ref={dialogRef}
        className="w-[min(100%,22rem)] rounded-[1.5rem] border border-white/[0.12] bg-navy-800 p-6 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop:bg-black/55"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
      >
        <p className="text-lg font-semibold leading-relaxed text-boss-accent">{t("successTitle")}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{t("successPopup")}</p>
        <button
          type="button"
          onClick={() => {
            const targetProduct = productId || preselectedProductId;
            closeDialog();
            if (targetProduct) router.push(`/product/${encodeURIComponent(targetProduct)}`);
          }}
          className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-white/[0.1] text-base font-semibold text-white transition hover:bg-white/[0.14]"
        >
          {productId || preselectedProductId.trim() ? t("backToProduct") : t("popupOk")}
        </button>
      </dialog>
    </>
  );
}
