'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CatalogFilter,
  CatalogSort,
  CatalogStats,
  Game,
  StoreConfig,
} from '@/types/game';
import { useCart } from './CartProvider';
import CategoryStrip from './CategoryStrip';
import Footer from './Footer';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';
import Header from './Header';
import HeroSlider from './HeroSlider';
import HowItWorks from './HowItWorks';
import TrustStrip from './TrustStrip';

const PAGE_SIZE = 24;

interface CatalogClientProps {
  initialGames: Game[];
  initialStats: CatalogStats;
  config: StoreConfig;
  updatedAt: string;
}

export default function CatalogClient({
  initialGames,
  initialStats,
  config,
}: CatalogClientProps) {
  const { setWhatsappPhone } = useCart();
  const [filter, setFilter] = useState<CatalogFilter>('ALL');
  const [sort, setSort] = useState<CatalogSort>('DEFAULT');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickViewGame, setQuickViewGame] = useState<Game | null>(null);

  // Sync live WhatsApp phone from Google Sheet config into CartProvider
  useEffect(() => {
    if (config.whatsappPhone) {
      setWhatsappPhone(config.whatsappPhone);
    }
  }, [config.whatsappPhone, setWhatsappPhone]);

  // Support deep-link URL query parameters (?filter=PS5 or ?q=GTA) cleanly on client mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilter = (params.get('filter') || '').toUpperCase();
    const urlQ = params.get('q') || '';
    if (
      urlFilter === 'PS5' ||
      urlFilter === 'PS4' ||
      urlFilter === 'OFERTAS' ||
      urlFilter === 'PREVENTAS'
    ) {
      setFilter(urlFilter);
    }
    if (urlQ.trim()) {
      setSearchQuery(urlQ.trim());
    }
  }, []);

  // Top 3 real games for Hero Showcase (prefer games with real covers & offers)
  const heroShowcaseGames = useMemo(() => {
    const offers = initialGames.filter((g) => g.isOffer);
    const offersWithImg = offers.filter((g) => Boolean(g.imageUrl));
    const pool = offersWithImg.length >= 2 ? offersWithImg : offers;

    const first = pool[0] || initialGames[0];
    const second =
      pool.find((g) => g.id !== first?.id) || initialGames[1];
    const third =
      initialGames.find(
        (g) =>
          g.console.toUpperCase().includes('PS4') &&
          Boolean(g.imageUrl) &&
          g.id !== first?.id &&
          g.id !== second?.id
      ) ||
      offers.find(
        (g) =>
          g.console.toUpperCase().includes('PS4') &&
          g.id !== first?.id &&
          g.id !== second?.id
      ) ||
      initialGames.find(
        (g) => g.id !== first?.id && g.id !== second?.id
      );

    return [first, second, third].filter((g): g is Game => Boolean(g));
  }, [initialGames]);

  // 4 Featured Offers strip
  const featuredOffers = useMemo(() => {
    const offers = initialGames.filter((g) => g.isOffer);
    const withCover = offers.filter((g) => Boolean(g.imageUrl));
    const withoutCover = offers.filter((g) => !g.imageUrl);
    const prioritized = [...withCover, ...withoutCover];
    return prioritized.length > 0
      ? prioritized.slice(0, 4)
      : initialGames.slice(0, 4);
  }, [initialGames]);

  // Filtered + Sorted games
  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = initialGames.filter((g) => {
      if (filter === 'PS5' && !g.console.toUpperCase().includes('PS5')) {
        return false;
      }
      if (filter === 'PS4' && !g.console.toUpperCase().includes('PS4')) {
        return false;
      }
      if (filter === 'OFERTAS' && !g.isOffer) return false;
      if (filter === 'PREVENTAS' && !g.isPreorder) return false;

      if (q) {
        const matchName = g.name.toLowerCase().includes(q);
        const matchConsole = g.console.toLowerCase().includes(q);
        const matchObs = (g.observation || '').toLowerCase().includes(q);
        if (!matchName && !matchConsole && !matchObs) return false;
      }
      return true;
    });

    if (sort === 'PRICE_ASC') {
      return [...list].sort((a, b) => a.minPrice - b.minPrice);
    }
    if (sort === 'PRICE_DESC') {
      return [...list].sort((a, b) => b.primaryPrice - a.primaryPrice);
    }
    if (sort === 'NAME_ASC') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [initialGames, filter, sort, searchQuery]);

  const visibleGames = useMemo(
    () => filteredGames.slice(0, visibleCount),
    [filteredGames, visibleCount]
  );

  const handleSelectFilter = useCallback(
    (nextFilter: CatalogFilter, scroll = true) => {
      setFilter(nextFilter);
      setVisibleCount(PAGE_SIZE);
      if (scroll) {
        const el = document.getElementById('catalogo');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleResetAll = useCallback(() => {
    setSearchQuery('');
    setSort('DEFAULT');
    setFilter('ALL');
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handlePickGameFromSearch = useCallback((game: Game) => {
    setQuickViewGame(game);
  }, []);

  const filterPills: { key: CatalogFilter; label: string; idleClass: string }[] = [
    {
      key: 'ALL',
      label: 'Todos',
      idleClass: 'text-textoSuave hover:border-rojo hover:text-white',
    },
    {
      key: 'PS5',
      label: 'PS5',
      idleClass: 'text-textoSuave hover:border-rojo hover:text-white',
    },
    {
      key: 'PS4',
      label: 'PS4',
      idleClass: 'text-textoSuave hover:border-rojo hover:text-white',
    },
    {
      key: 'OFERTAS',
      label: '🔥 Ofertas',
      idleClass: 'text-rojoVivo hover:border-rojo hover:text-white',
    },
    {
      key: 'PREVENTAS',
      label: '⚡ Preventas',
      idleClass: 'text-verdeVivo hover:border-verdeGeek hover:text-white',
    },
  ];

  const remainingCount = Math.max(0, filteredGames.length - visibleGames.length);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1, 2, 3: Announcement Bar + Sticky Header + Category Sub-Navbar */}
      <Header
        config={config}
        games={initialGames}
        activeFilter={filter}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSelectFilter={handleSelectFilter}
        onResetAll={handleResetAll}
        onSelectGame={handlePickGameFromSearch}
      />

      {/* 4: Hero Section Slider */}
      <HeroSlider
        stats={initialStats}
        showcaseGames={heroShowcaseGames}
        onQuickFilter={(f) => handleSelectFilter(f, true)}
        onSelectGame={setQuickViewGame}
      />

      {/* 5: Elegí tu terreno */}
      <CategoryStrip
        stats={initialStats}
        onSelectFilter={(f) => handleSelectFilter(f, true)}
      />

      {/* 6: Ofertas Destacadas */}
      {featuredOffers.length > 0 && (
        <section
          id="ofertas-destacadas"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2 w-full scroll-mt-28"
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="section-heading text-lg sm:text-xl font-black italic uppercase tracking-wide text-white">
              Ofertas destacadas
            </h2>
            <button
              type="button"
              onClick={() => handleSelectFilter('OFERTAS', true)}
              className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent)] hover:text-white transition"
            >
              Ver todas las ofertas →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredOffers.map((game) => (
              <GameCard
                key={`feat-${game.id}`}
                game={game}
                whatsappPhone={config.whatsappPhone}
                onQuickView={setQuickViewGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7: Catálogo Completo con Filtros y Ordenamiento */}
      <main
        id="catalogo"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 w-full flex-1 scroll-mt-28"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="section-heading text-lg sm:text-2xl font-black italic uppercase tracking-wide text-white">
              Catálogo Completo
            </h2>
            <p className="text-xs font-semibold text-muted mt-1 ml-4">
              {filteredGames.length === 0
                ? '0 títulos encontrados'
                : `Mostrando ${visibleGames.length} de ${filteredGames.length} títulos disponibles`}
            </p>
          </div>

          {/* Controles: Pills + Ordenar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filterPills.map((pill) => {
                const active = filter === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => handleSelectFilter(pill.key, false)}
                    className={`px-3.5 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition ${
                      active
                        ? 'theme-btn text-white shadow-md shadow-[var(--accent-glow)]'
                        : `bg-panel border border-linea ${pill.idleClass}`
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            <select
              aria-label="Ordenar por"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as CatalogSort);
                setVisibleCount(PAGE_SIZE);
              }}
              className="bg-panel2 border border-linea focus:border-accent rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-texto focus:outline-none"
            >
              <option value="DEFAULT">Orden: Destacados</option>
              <option value="PRICE_ASC">Precio: Menor a Mayor</option>
              <option value="PRICE_DESC">Precio: Mayor a Menor</option>
              <option value="NAME_ASC">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-panel border border-linea rounded-2xl">
            <div className="text-4xl">🎮</div>
            <h3 className="text-base font-extrabold uppercase text-white mt-3">
              No encontramos juegos con ese filtro
            </h3>
            <p className="text-xs text-muted mt-1">
              Probá borrando la búsqueda o cambiando de consola.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="mt-4 px-5 py-2 rounded-lg bg-panel2 border border-linea hover:border-accent text-xs font-bold uppercase text-white transition"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <>
            {/* Grid Principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {visibleGames.map((game) => (
                <GameCard
                  key={`cat-${game.id}`}
                  game={game}
                  whatsappPhone={config.whatsappPhone}
                  onQuickView={setQuickViewGame}
                />
              ))}
            </div>

            {/* Botón Cargar Más */}
            {remainingCount > 0 && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="corte-btn inline-flex items-center gap-2 bg-panel2 hover:bg-[var(--accent)] border border-lineaFuerte hover:border-[var(--accent)] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 transition"
                >
                  <span>Cargar más juegos</span>
                  <span className="text-muted">(+{remainingCount} más)</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 8: Primaria vs Secundaria */}
      <HowItWorks />

      {/* 9: Franja de Beneficios */}
      <TrustStrip />

      {/* 10: Footer 4 Columnas */}
      <Footer
        config={config}
        onSelectFilter={(f) => handleSelectFilter(f, true)}
      />

      {/* Quick-View Modal */}
      <GameDetailModal
        game={quickViewGame}
        whatsappPhone={config.whatsappPhone}
        onClose={() => setQuickViewGame(null)}
      />
    </div>
  );
}
