'use client';

import { useEffect, useState } from 'react';
import type { CatalogFilter, CatalogStats, Game } from '@/types/game';
import GameCover from './GameCover';
import { formatMoney } from './format';

interface HeroSliderProps {
  stats: CatalogStats;
  showcaseGames: Game[];
  onQuickFilter: (filter: CatalogFilter) => void;
  onSelectGame: (game: Game) => void;
}

interface HeroSlide {
  glowClass: string;
  chip: string;
  chipStyle: string;
  line1: string;
  line2: string;
  strokeClass: string;
  dotColor: string;
  subtitlePrefix: string;
  subtitleStrong: string;
  subtitleSuffix: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    glowClass: 'hero-glow-red',
    chip: 'JUEGOS DIGITALES · STOCK EN VIVO',
    chipStyle: 'border-rojo/50 bg-rojo/10 text-rojoVivo',
    line1: 'LOS MEJORES',
    line2: 'JUEGOS DIGITALES',
    strokeClass: 'text-stroke-red',
    dotColor: 'text-rojo',
    subtitlePrefix: 'Catálogo completo de ',
    subtitleStrong: 'PS4 y PS5 con precios actualizados al instante',
    subtitleSuffix:
      '. Elegí cuenta Primaria o Secundaria y coordiná directo por WhatsApp.',
  },
  {
    glowClass: 'hero-glow-blue',
    chip: 'NEXT-GEN · PLAYSTATION 5',
    chipStyle: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    line1: 'ESTRENOS Y',
    line2: 'PREVENTAS PS5',
    strokeClass: 'text-stroke-blue',
    dotColor: 'text-blue-500',
    subtitlePrefix: 'Reservá los lanzamientos más esperados del año en ',
    subtitleStrong: 'versión Primaria o Secundaria',
    subtitleSuffix: ' con garantía y entrega en el día.',
  },
  {
    glowClass: 'hero-glow-green',
    chip: 'PROMOS ACTIVAS · TIEMPO LIMITADO',
    chipStyle: 'border-verdeGeek/50 bg-verdeGeek/10 text-verdeVivo',
    line1: 'OFERTAS QUE',
    line2: 'NO EXISTEN',
    strokeClass: 'text-stroke-green',
    dotColor: 'text-verdeGeek',
    subtitlePrefix: 'Aprovechá más de ',
    subtitleStrong: '200 títulos en oferta especial',
    subtitleSuffix:
      ' para PS4 y PS5. Armá tu pedido en el carrito y consultá al instante.',
  },
];

export default function HeroSlider({
  stats,
  showcaseGames,
  onQuickFilter,
  onSelectGame,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = HERO_SLIDES[currentSlide];
  const card0 = showcaseGames[0];
  const card1 = showcaseGames[1];
  const card2 = showcaseGames[2];

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative border-b border-linea ${slide.glowClass} transition-all duration-500 overflow-hidden w-full`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Lado Izquierdo: Copy + CTA + Métricas */}
          <div className="lg:col-span-7 space-y-5">
            {/* Chip superior */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-[11px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${slide.chipStyle}`}
            >
              <span>⚡</span>
              <span>{slide.chip}</span>
            </div>

            {/* Título Monumental Italic + Outline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black italic uppercase leading-[0.98] tracking-tight">
              <span className="block text-white">{slide.line1}</span>
              <span className={`block ${slide.strokeClass}`}>
                {slide.line2}
                <span
                  className={slide.dotColor}
                  style={{ WebkitTextStroke: '0px' }}
                >
                  .
                </span>
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-sm sm:text-base text-textoSuave max-w-xl leading-relaxed">
              {slide.subtitlePrefix}
              <strong className="text-white">{slide.subtitleStrong}</strong>
              {slide.subtitleSuffix}
            </p>

            {/* Botones Dobles CTA */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onQuickFilter('ALL')}
                className="corte-btn inline-flex items-center gap-2.5 bg-rojo hover:bg-rojoVivo text-white text-xs sm:text-sm font-black uppercase tracking-wider px-6 py-3.5 shadow-lg shadow-rojo/30 transition active:scale-[0.98]"
              >
                <span>Ver Catálogo</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickFilter('OFERTAS')}
                className="inline-flex items-center gap-2 border border-verdeGeek hover:bg-verdeGeek/15 text-verdeVivo text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-md transition"
              >
                <span>🔥 Ver Ofertas</span>
              </button>
            </div>

            {/* Métricas de Confianza en vivo */}
            <div className="flex flex-wrap items-center gap-7 sm:gap-10 pt-4 border-t border-linea/70 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black italic text-white leading-none">
                  {stats.totalGames}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">
                  Títulos PS4 &amp; PS5
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black italic text-rojoVivo leading-none">
                  {stats.offersCount}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">
                  Ofertas Activas
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted leading-none">
                  ENTREGA DIGITAL
                </div>
                <div className="text-lg sm:text-xl font-black italic text-white uppercase mt-1 leading-none">
                  EN EL DÍA
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: 3 Tarjetas Flotantes con Tilt (alimentadas con juegos reales del Sheet) */}
          <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center min-h-[340px]">
            {/* Tarjeta Izquierda Principal (Tilt -3deg) */}
            {card0 && (
              <button
                type="button"
                onClick={() => onSelectGame(card0)}
                className="text-left cursor-pointer w-48 lg:w-52 bg-white text-fondo rounded-2xl p-3 shadow-2xl shadow-black/80 transform -rotate-3 hover:rotate-0 hover:scale-105 transition duration-300 z-20 border-2 border-white"
              >
                <div className="bg-[#00439c] text-white text-[10px] font-black italic tracking-widest px-2.5 py-1 rounded-t-lg flex items-center justify-between">
                  <span>{card0.console}</span>
                  <span>DIGITAL</span>
                </div>
                <GameCover
                  name={card0.name}
                  consoleName={card0.console}
                  imageUrl={card0.imageUrl}
                  variant="hero-main"
                  badgeLabel="DESTACADO"
                />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Desde
                  </span>
                  <span className="text-base font-black text-fondo">
                    {formatMoney(card0.minPrice)}
                  </span>
                </div>
              </button>
            )}

            {/* Columna Derecha (2 tarjetas apiladas con tilt) */}
            <div className="flex flex-col gap-4 -ml-5 z-10">
              {card1 && (
                <button
                  type="button"
                  onClick={() => onSelectGame(card1)}
                  className="text-left cursor-pointer w-44 lg:w-48 bg-white text-fondo rounded-2xl p-2.5 shadow-2xl shadow-black/80 transform rotate-3 hover:rotate-0 hover:scale-105 transition duration-300 border-2 border-white"
                >
                  <div className="bg-fondo text-white text-[9px] font-black italic tracking-widest px-2 py-1 rounded-t-lg flex justify-between">
                    <span>{card1.console}</span>
                    <span className="text-rojoVivo">🔥 OFERTA</span>
                  </div>
                  <GameCover
                    name={card1.name}
                    consoleName={card1.console}
                    imageUrl={card1.imageUrl}
                    variant="hero-sub"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">
                      Desde
                    </span>
                    <span className="text-sm font-black text-rojo">
                      {formatMoney(card1.minPrice)}
                    </span>
                  </div>
                </button>
              )}

              {card2 && (
                <button
                  type="button"
                  onClick={() => onSelectGame(card2)}
                  className="text-left cursor-pointer w-44 lg:w-48 bg-white text-fondo rounded-2xl p-2.5 shadow-2xl shadow-black/80 transform -rotate-2 hover:rotate-0 hover:scale-105 transition duration-300 border-2 border-verdeGeek"
                >
                  <div className="bg-verdeGeek text-white text-[9px] font-black italic tracking-widest px-2 py-1 rounded-t-lg flex justify-between">
                    <span>{card2.console}</span>
                    <span>TOP VENTAS</span>
                  </div>
                  <GameCover
                    name={card2.name}
                    consoleName={card2.console}
                    imageUrl={card2.imageUrl}
                    variant="hero-sub"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">
                      Desde
                    </span>
                    <span className="text-sm font-black text-fondo">
                      {formatMoney(card2.minPrice)}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controles del Slider (Estilo The Best) */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide anterior"
            className="w-8 h-8 rounded-full bg-panel2 border border-linea hover:border-rojo text-textoSuave hover:text-white flex items-center justify-center transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.line1}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-rojo'
                    : 'w-6 bg-lineaFuerte hover:bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide siguiente"
            className="w-8 h-8 rounded-full bg-panel2 border border-linea hover:border-rojo text-textoSuave hover:text-white flex items-center justify-center transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
