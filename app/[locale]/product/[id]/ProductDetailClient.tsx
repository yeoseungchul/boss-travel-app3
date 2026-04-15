"use client";

import { useMemo, useState } from "react";

function parseYouTubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    // Accept plain ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
    const u = new URL(raw);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "").slice(0, 64);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (m?.[1]) return m[1];
    }
  } catch {
    // ignore
  }
  return null;
}

function YouTubeLite({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-black">
      <div className="relative aspect-video w-full">
        {active ? (
          <iframe
            title={title}
            src={src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 h-full w-full"
            aria-label={title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
                <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white/90" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export function ProductDetailClient({
  youtubeUrl,
  title,
  subtitle,
}: {
  youtubeUrl: string | null;
  title: string;
  subtitle: string;
}) {
  const videoId = useMemo(() => (youtubeUrl ? parseYouTubeId(youtubeUrl) : null), [youtubeUrl]);
  if (!videoId) return null;

  return (
    <section className="rounded-[1.25rem] border border-boss-accent/20 bg-navy-800/50 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-semibold text-boss-accent">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{subtitle}</p>
      <div className="mt-4">
        <YouTubeLite videoId={videoId} title={title} />
      </div>
    </section>
  );
}

