'use client';

import React from 'react';

interface DestinationVideoTileProps {
  product: {
    id: string;
    title: string;
    youtube_url?: string;
  };
}

export default function DestinationVideoTile({ product }: DestinationVideoTileProps) {
  // 유튜브 주소를 '재생 가능'하게 변환하는 마법의 함수
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      return url;
    }

    if (!videoId) return '';

    // 자동재생, 음소거(정책상 필수), 무한반복 설정 포함
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
  };

  const embedUrl = getEmbedUrl(product.youtube_url || '');

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-900">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full object-cover scale-[1.5]" // 검은 테두리 제거를 위해 살짝 확대
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none' }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          영상을 준비 중입니다
        </div>
      )}
      
      {/* 영상 위에 얹어지는 럭셔리한 텍스트 층 */}
      <div className="absolute inset-0 bg-black/30 p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <span className="text-white">▶</span>
        </div>
      </div>
    </div>
  );
}