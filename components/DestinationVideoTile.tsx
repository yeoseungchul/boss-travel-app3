"use client";

import { useCallback, useRef, useState } from "react";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

type Props = {
  label: string;
  src: string;
  tint: string;
};

export function DestinationVideoTile({ label, src, tint }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="group relative w-full overflow-hidden rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-0)] text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)] outline-none ring-boss-accent/0 transition-[transform,box-shadow] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-boss-accent"
      aria-label={label}
    >
      <div className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-t ${tint} via-transparent to-black/25`} />
      <video
        ref={ref}
        className="aspect-[16/10] w-full object-cover opacity-95 transition duration-500 group-hover:opacity-100"
        src={src}
        muted
        playsInline
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <p className="text-lg font-light tracking-[0.12em] text-white/90">{label}</p>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.08] text-white backdrop-blur-md transition group-hover:bg-boss-accent-soft group-hover:text-boss-accent">
            {playing ? (
              <span className="flex h-5 w-5 items-center justify-center gap-0.5" aria-hidden>
                <span className="h-4 w-1 rounded-sm bg-current" />
                <span className="h-4 w-1 rounded-sm bg-current" />
              </span>
            ) : (
              <PlayIcon className="h-7 w-7 translate-x-0.5" />
            )}
          </span>
        </div>
        <div className="flex items-center gap-2" aria-hidden>
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse bg-boss-accent shadow-[0_0_12px_rgba(199,179,119,0.8)]" : "bg-white/20"}`}
          />
          <span className="h-px flex-1 rounded-full bg-gradient-to-r from-white/25 to-transparent" />
        </div>
      </div>
    </button>
  );
}
