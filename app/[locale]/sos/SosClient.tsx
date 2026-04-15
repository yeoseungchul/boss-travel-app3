"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "loading" | "ready" | "sent" | "denied" | "unsupported";

export function SosClient() {
  const t = useTranslations("Sos");
  const [status, setStatus] = useState<Status>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 0 },
    );
  }

  function sendLocation() {
    setStatus("sent");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[1.25rem] border border-white/[0.08] bg-navy-800/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t("location")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{t("locationHint")}</p>
        <div className="mt-5 min-h-[4.5rem] rounded-2xl border border-white/[0.08] bg-navy-950/60 px-4 py-4 text-center font-mono text-base text-white/80">
          {coords ? (
            <>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </>
          ) : (
            <span className="text-white/40">{t("noLocation")}</span>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={requestLocation}
        disabled={status === "loading"}
        className="flex min-h-16 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06] text-lg font-semibold text-white transition enabled:hover:border-boss-accent/40 enabled:hover:bg-boss-accent-soft/30 disabled:opacity-50"
      >
        {status === "loading" ? "…" : t("getLocation")}
      </button>

      <button
        type="button"
        onClick={sendLocation}
        disabled={!coords || status === "sent"}
        className="flex min-h-16 items-center justify-center rounded-2xl bg-red-500/90 text-lg font-semibold text-white shadow-lg transition hover:bg-red-500 disabled:opacity-40"
      >
        {t("send")}
      </button>

      {status === "sent" && (
        <p className="rounded-2xl border border-boss-accent/30 bg-boss-accent-soft/30 px-4 py-4 text-center text-base font-medium text-boss-accent">
          {t("sent")}
        </p>
      )}
      {status === "denied" && (
        <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-4 text-center text-sm text-red-200/90">{t("denied")}</p>
      )}
      {status === "unsupported" && (
        <p className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-center text-sm text-white/65">{t("unavailable")}</p>
      )}
    </div>
  );
}
