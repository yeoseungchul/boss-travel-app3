'use client';

import React, { useMemo, useState } from 'react';

type Props = {
  label: string;
  src: string;
  tint?: string;
};

function extractYoutubeVideoId(url: string): string {
  const raw = (url ?? "").trim();
  if (!raw) return '';

  // If DB stored the ID directly.
  if (/^[a-zA-Z0-9_-]{6,}$/.test(raw) && !raw.includes("/") && !raw.includes("?") && !raw.includes("&")) {
    return raw;
  }

  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  // https://www.youtube.com/live/VIDEO_ID
  try {
    const u = new URL(raw);
    const v = u.searchParams.get('v');
    if (v) return v;
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return (u.pathname.split('/embed/')[1] ?? '').split('/')[0] ?? '';
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      return (u.pathname.split('/shorts/')[1] ?? '').split('/')[0] ?? '';
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/live/')) {
      return (u.pathname.split('/live/')[1] ?? '').split('/')[0] ?? '';
    }
  } catch {
    // Fallback for non-URL strings
    if (raw.includes('youtube.com/embed/')) return raw.split('youtube.com/embed/')[1]?.split(/[?&/]/)[0] ?? '';
    if (raw.includes('youtube.com/shorts/')) return raw.split('youtube.com/shorts/')[1]?.split(/[?&/]/)[0] ?? '';
    if (raw.includes('youtube.com/live/')) return raw.split('youtube.com/live/')[1]?.split(/[?&/]/)[0] ?? '';
    if (raw.includes('v=')) return raw.split('v=')[1]?.split('&')[0] ?? '';
    if (raw.includes('youtu.be/')) return raw.split('youtu.be/')[1]?.split('?')[0] ?? '';
  }

  return '';
}

function youtubeEmbedUrl(videoId: string) {
  if (!videoId) return '';
  // Autoplay works best when initiated by user gesture; keep mute on for permissive autoplay.
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`;
}

function youtubeThumbnailUrl(videoId: string) {
  if (!videoId) return '';
  // maxresdefault may 404 for some videos, so we fall back via onError.
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export function DestinationVideoTile({ label, src, tint }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = useMemo(() => extractYoutubeVideoId(src), [src]);
  const embedUrl = useMemo(() => youtubeEmbedUrl(videoId), [videoId]);
  const thumbUrl = useMemo(() => youtubeThumbnailUrl(videoId), [videoId]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-950">
      {videoId ? (
        isPlaying ? (
          <iframe
            src={embedUrl}
            title={label}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-0 h-full w-full text-left"
            aria-label={`${label} 재생`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/35 backdrop-blur-md">
                <PlayGlyph className="h-7 w-7 translate-x-0.5" />
              </span>
            </div>
          </button>
        )
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-gray-400">영상 링크가 없어요.</div>
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-10 ${tint ?? 'bg-black/15'} p-6 flex flex-col justify-end`}
      >
        <h3 className="text-xl font-bold text-white">{label}</h3>
      </div>
    </div>
  );
}