'use client';

import { useEffect, useState } from 'react';
import { getCoverGradient } from './format';

interface GameCoverProps {
  name: string;
  consoleName: string;
  imageUrl?: string;
  variant?: 'card' | 'detail' | 'thumb' | 'hero-main' | 'hero-sub';
  badgeLabel?: string;
}

export default function GameCover({
  name,
  consoleName,
  imageUrl,
  variant = 'card',
  badgeLabel,
}: GameCoverProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const hasValidUrl = Boolean(imageUrl && imageUrl.trim().startsWith('http') && !imgError);
  const isPS5 = (consoleName || '').toUpperCase().includes('PS5');
  const headerStripBg = isPS5
    ? 'bg-white text-fondo border-b border-gray-200'
    : 'bg-[#00439c] text-white';
  const gradient = getCoverGradient(name, consoleName);

  if (variant === 'thumb') {
    if (hasValidUrl) {
      return (
        <div className="w-12 h-14 rounded-lg bg-white overflow-hidden shrink-0 border border-linea flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div
        className={`w-12 h-14 rounded-lg bg-gradient-to-br ${gradient} shrink-0 border border-linea flex flex-col justify-between p-1.5 overflow-hidden`}
      >
        <span className="text-[7px] font-black italic uppercase tracking-wider text-white/80">
          {consoleName}
        </span>
        <span className="text-[8px] font-black italic uppercase leading-tight text-white line-clamp-2">
          {name}
        </span>
      </div>
    );
  }

  if (variant === 'hero-main' || variant === 'hero-sub') {
    const heightClass = variant === 'hero-main' ? 'h-36' : 'h-24';
    const titleSize = variant === 'hero-main' ? 'text-sm' : 'text-xs';

    if (hasValidUrl) {
      return (
        <div className={`${heightClass} rounded-b-lg overflow-hidden relative bg-[#0c1222]`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-2.5 flex flex-col justify-between">
            {badgeLabel ? (
              <span className="text-[9px] font-black uppercase bg-rojo text-white px-2 py-0.5 rounded w-fit shadow">
                {badgeLabel}
              </span>
            ) : (
              <span />
            )}
            <div className={`font-black italic uppercase ${titleSize} leading-tight line-clamp-2 text-white drop-shadow`}>
              {name}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${heightClass} bg-gradient-to-br ${gradient} rounded-b-lg p-3 flex flex-col justify-between text-white relative overflow-hidden`}
      >
        <div className="absolute -right-3 -bottom-3 text-white/[0.07] text-5xl font-black italic select-none pointer-events-none">
          {consoleName}
        </div>
        {badgeLabel ? (
          <span className="text-[9px] font-black uppercase bg-rojo px-2 py-0.5 rounded w-fit relative z-10">
            {badgeLabel}
          </span>
        ) : (
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 relative z-10">
            PLAYSTATION
          </span>
        )}
        <div className={`font-black italic uppercase ${titleSize} leading-tight line-clamp-2 relative z-10 drop-shadow`}>
          {name}
        </div>
      </div>
    );
  }

  // Card & Detail variants
  if (hasValidUrl) {
    if (variant === 'detail') {
      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-[#0d0d12] relative shadow-md border border-gray-200/80">
          {/* Ambient blurred backdrop so both landscape and portrait covers fill cleanly */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-45"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            loading="eager"
            onError={() => setImgError(true)}
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain p-2 drop-shadow-2xl"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-[#0d0d12] relative shadow-md border border-gray-200/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div
        className={`${headerStripBg} px-2.5 py-1 flex items-center justify-between text-[9px] font-black italic tracking-widest`}
      >
        <span>{consoleName}</span>
        <span className="opacity-70">DIGITAL</span>
      </div>
      <div
        className={`flex-1 bg-gradient-to-br ${gradient} ${
          variant === 'detail' ? 'p-6' : 'p-3.5'
        } flex flex-col justify-between relative overflow-hidden`}
      >
        <div
          className={`absolute -right-4 -bottom-4 text-white/[0.06] ${
            variant === 'detail' ? 'text-8xl' : 'text-7xl'
          } font-black italic select-none pointer-events-none`}
        >
          {consoleName}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 relative z-10">
          PLAYSTATION STORE
        </span>
        <div
          className={`text-white font-black italic uppercase ${
            variant === 'detail' ? 'text-xl sm:text-2xl' : 'text-sm'
          } leading-tight line-clamp-2 drop-shadow relative z-10`}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
