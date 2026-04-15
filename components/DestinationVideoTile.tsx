'use client';

import React from 'react';

export default function DestinationVideoTile({ product }: any) {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('embed/')) return url;
    
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
  };

  const embedUrl = getEmbedUrl(product.src || ''); // page.tsx에서 src로 넘겨줍니다.

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-900">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full object-cover scale-[1.5]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none' }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          영상을 불러오는 중...
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2">{product.label}</h3>
      </div>
    </div>
  );
}