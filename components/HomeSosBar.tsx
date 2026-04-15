"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SimPhase = "sending" | "done";

function SosGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function HomeSosBar() {
  const t = useTranslations("Home");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<SimPhase>("sending");
  const [coords, setCoords] = useState<string | null>(null);

  const open = useCallback(() => {
    setPhase("sending");
    setCoords(null);
    dialogRef.current?.showModal();

    const finish = (lat: number, lng: number) => {
      setCoords(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setPhase("done");
    };

    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => finish(pos.coords.latitude, pos.coords.longitude),
        () => finish(37.5665, 126.978),
        { timeout: 8000, maximumAge: 60_000 },
      );
    } else {
      window.setTimeout(() => finish(22.1987, 113.5439), 1200);
    }
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setCoords(null);
  }, []);

  return (
    <>
      <section className="mt-4 border-t border-white/[0.06] pt-8" aria-label={t("sosCta")}>
        <button
          type="button"
          onClick={open}
          className="flex w-full min-h-[4.25rem] items-center justify-center gap-3 rounded-2xl border-2 border-red-400/45 bg-gradient-to-b from-red-600/90 to-red-800/95 text-lg font-bold tracking-wide text-white shadow-[0_12px_40px_rgba(220,38,38,0.35)] transition hover:brightness-110 active:scale-[0.99]"
        >
          <SosGlyph className="h-7 w-7 shrink-0" />
          {t("sosCta")}
        </button>
      </section>

      <dialog
        ref={dialogRef}
        className="w-[min(100%,22rem)] rounded-[1.5rem] border border-red-500/25 bg-navy-900 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop:bg-black/60"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/90">{t("sosModalTitle")}</p>
        <p className="mt-4 text-lg font-medium leading-relaxed text-white">{t("sosModalBody")}</p>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-navy-950/80 p-4 text-left">
          {phase === "sending" && !coords && <p className="text-sm text-white/70">{t("sosSimulating")}</p>}
          {phase === "done" && coords && (
            <div className="space-y-2">
              <p className="font-mono text-sm text-boss-accent">{coords}</p>
              <p className="text-sm text-white/75">{t("sosSimDone")}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-white/[0.1] text-base font-semibold transition hover:bg-white/[0.14]"
        >
          {t("sosClose")}
        </button>
      </dialog>
    </>
  );
}
