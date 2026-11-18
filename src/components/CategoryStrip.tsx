'use client';

import type { CatalogFilter, CatalogStats } from '@/types/game';

interface CategoryStripProps {
  stats: CatalogStats;
  onSelectFilter: (filter: CatalogFilter) => void;
}

export default function CategoryStrip({
  stats,
  onSelectFilter,
}: CategoryStripProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-heading text-lg sm:text-xl font-black italic uppercase tracking-wide text-white">
          Elegí tu terreno
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted hidden sm:inline">
          Filtrá por consola o promo
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PS5 */}
        <button
          type="button"
          onClick={() => onSelectFilter('PS5')}
          className="cat-card rounded-xl overflow-hidden text-left group"
        >
          <div className="h-24 sm:h-28 bg-white corte-foto flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
            <div className="relative z-10 text-center">
              <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-[#003087] group-hover:scale-110 inline-block transition">
                PS5
              </span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.25em] text-gray-500">
                NEXT-GEN
              </span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="font-black italic uppercase text-sm text-white group-hover:text-[var(--accent)] transition-colors">
              PlayStation 5
            </div>
            <div className="text-[11px] font-bold text-muted uppercase mt-0.5">
              {stats.ps5Count} TÍTULOS
            </div>
          </div>
        </button>

        {/* PS4 */}
        <button
          type="button"
          onClick={() => onSelectFilter('PS4')}
          className="cat-card rounded-xl overflow-hidden text-left group"
        >
          <div className="h-24 sm:h-28 bg-white corte-foto flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white" />
            <div className="relative z-10 text-center">
              <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-[#0070d1] group-hover:scale-110 inline-block transition">
                PS4
              </span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.25em] text-gray-500">
                CLÁSICOS &amp; HITS
              </span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="font-black italic uppercase text-sm text-white group-hover:text-[var(--accent)] transition-colors">
              PlayStation 4
            </div>
            <div className="text-[11px] font-bold text-muted uppercase mt-0.5">
              {stats.ps4Count} TÍTULOS
            </div>
          </div>
        </button>

        {/* Ofertas */}
        <button
          type="button"
          onClick={() => onSelectFilter('OFERTAS')}
          className="cat-card rounded-xl overflow-hidden text-left group"
        >
          <div className="h-24 sm:h-28 bg-white corte-foto flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white" />
            <div className="relative z-10 text-center">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tight text-[var(--accent)] group-hover:scale-110 inline-block transition">
                🔥 OFERTAS
              </span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                TIEMPO LIMITADO
              </span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="font-black italic uppercase text-sm text-white group-hover:text-[var(--accent)] transition-colors">
              Promociones
            </div>
            <div className="text-[11px] font-bold text-rojoVivo uppercase mt-0.5">
              {stats.offersCount} EN PROMO
            </div>
          </div>
        </button>

        {/* Preventas */}
        <button
          type="button"
          onClick={() => onSelectFilter('PREVENTAS')}
          className="cat-card rounded-xl overflow-hidden text-left group"
        >
          <div className="h-24 sm:h-28 bg-white corte-foto flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white" />
            <div className="relative z-10 text-center">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tight text-verdeGeek group-hover:scale-110 inline-block transition">
                ⚡ ESTRENOS
              </span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                PREVENTAS
              </span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="font-black italic uppercase text-sm text-white group-hover:text-verdeVivo transition">
              Lanzamientos
            </div>
            <div className="text-[11px] font-bold text-verdeVivo uppercase mt-0.5">
              {stats.preordersCount} PREVENTAS
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
