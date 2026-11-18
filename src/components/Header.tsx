'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CatalogFilter, Game, StoreConfig } from '@/types/game';
import { useCart } from './CartProvider';
import GameCover from './GameCover';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { buildGeneralWaLink, DEFAULT_STORE_CONFIG, formatMoney } from './format';

interface HeaderProps {
  config?: StoreConfig;
  games?: Game[];
  activeFilter?: CatalogFilter;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSelectFilter?: (filter: CatalogFilter, scroll?: boolean) => void;
  onResetAll?: () => void;
  onSelectGame?: (game: Game) => void;
}

export default function Header({
  config = DEFAULT_STORE_CONFIG,
  games,
  activeFilter = 'ALL',
  searchQuery: controlledSearch,
  onSearchChange,
  onSelectFilter,
  onResetAll,
  onSelectGame,
}: HeaderProps) {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { theme, logoSrc, themeName } = useTheme();
  const [localSearch, setLocalSearch] = useState(controlledSearch || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [remoteMatches, setRemoteMatches] = useState<Game[]>([]);
  const [remoteTotal, setRemoteTotal] = useState(0);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = typeof onSearchChange === 'function';
  const currentSearch = isControlled ? controlledSearch || '' : localSearch;
  const trimmedQuery = currentSearch.trim().toLowerCase();

  // Close autocomplete on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Local instant autocomplete when full games list is available
  const localMatches = useMemo(() => {
    if (!games || trimmedQuery.length < 2) return [];
    return games.filter(
      (g) =>
        g.name.toLowerCase().includes(trimmedQuery) ||
        g.console.toLowerCase().includes(trimmedQuery)
    );
  }, [games, trimmedQuery]);

  // Remote autocomplete fallback (used on /juego/[slug] page where full list isn't passed)
  useEffect(() => {
    if (games || trimmedQuery.length < 2) {
      setRemoteMatches([]);
      setRemoteTotal(0);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/catalog?q=${encodeURIComponent(trimmedQuery)}&limit=6`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setRemoteMatches(Array.isArray(data.games) ? data.games : []);
        setRemoteTotal(typeof data.totalFiltered === 'number' ? data.totalFiltered : 0);
      } catch {
        // Ignore abort / network errors during typing
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [games, trimmedQuery]);

  const previewMatches = games ? localMatches.slice(0, 6) : remoteMatches;
  const totalMatchCount = games ? localMatches.length : remoteTotal;
  const showDropdown =
    dropdownOpen && trimmedQuery.length >= 2 && previewMatches.length > 0;

  const waHref = buildGeneralWaLink(config.whatsappPhone);

  const handleInputChange = (val: string) => {
    if (isControlled && onSearchChange) {
      onSearchChange(val);
    } else {
      setLocalSearch(val);
    }
    setDropdownOpen(val.trim().length >= 2);
  };

  const handleClearSearch = () => {
    handleInputChange('');
    setDropdownOpen(false);
  };

  const handlePickGame = (game: Game) => {
    setDropdownOpen(false);
    if (onSelectGame) {
      onSelectGame(game);
    } else {
      router.push(`/juego/${game.slug}`);
    }
  };

  const handleViewAllResults = () => {
    setDropdownOpen(false);
    if (isControlled) {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmedQuery) {
      router.push(`/?q=${encodeURIComponent(currentSearch.trim())}#catalogo`);
    }
  };

  const handleNavFilter = (filter: CatalogFilter) => {
    if (onSelectFilter) {
      onSelectFilter(filter, true);
    } else {
      router.push(filter === 'ALL' ? '/#catalogo' : `/?filter=${filter}#catalogo`);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onResetAll) {
      e.preventDefault();
      onResetAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems: { key: CatalogFilter; label: string; accent?: string }[] = [
    { key: 'ALL', label: 'Catálogo' },
    { key: 'PS5', label: 'PlayStation 5' },
    { key: 'PS4', label: 'PlayStation 4' },
    { key: 'OFERTAS', label: '🔥 Ofertas', accent: 'theme-accent-text' },
    { key: 'PREVENTAS', label: 'Preventas' },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Color dinámico según tema: Vice Pink o Cyan Arcade) */}
      <div className="theme-topbar text-white text-[12px] sm:text-[13px] font-semibold w-full shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="truncate">{config.announcement}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Quick Theme Switcher Pill in Top Bar */}
            <ThemeToggle variant="topbar" />

            <div className="hidden sm:flex items-center gap-5 text-[11px] font-bold tracking-wider uppercase">
              <a href="#como-funciona" className="hover:text-white/80 transition">
                Cómo funciona
              </a>
              <button
                type="button"
                onClick={() => handleNavFilter('OFERTAS')}
                className="hover:text-white/80 transition uppercase"
              >
                Ofertas
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-fondo/95 backdrop-blur-md border-b border-linea w-full transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo Oficial INTERGAMES ROSARIO dinámico según tema */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
            title={`${config.storeName || 'INTERGAMES ROSARIO'} - Inicio (Tema: ${themeName})`}
          >
            <div className="relative h-11 sm:h-13 w-auto flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt={config.storeName || 'INTERGAMES ROSARIO'}
                className="h-10 sm:h-12 md:h-13 w-auto max-w-[170px] sm:max-w-[210px] md:max-w-[240px] object-contain drop-shadow-[0_2px_12px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Accessible screen-reader title */}
            <span className="sr-only">
              {config.storeName || 'INTERGAMES ROSARIO'} - {config.tagline}
            </span>
          </Link>

          {/* Barra de Búsqueda Centrada con Autocomplete en vivo */}
          <div className="flex-1 max-w-xl relative" ref={searchWrapperRef}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleViewAllResults();
              }}
              className="flex items-center bg-panel2 border border-linea focus-within:border-accent rounded-xl px-3.5 py-2 sm:py-2.5 transition"
            >
              <svg
                className="w-4 h-4 text-muted mr-2.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                autoComplete="off"
                value={currentSearch}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => {
                  if (trimmedQuery.length >= 2) setDropdownOpen(true);
                }}
                placeholder="Buscar juegos de PS4, PS5 (ej. GTA, FC27, Spider-Man)..."
                aria-label="Buscar juegos"
                className="w-full bg-transparent text-xs sm:text-sm text-texto placeholder-muted focus:outline-none font-medium"
              />
              {currentSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Limpiar búsqueda"
                  className="text-muted hover:text-white text-xs font-bold pl-2 transition"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Dropdown Autocomplete en vivo */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-panel border border-lineaFuerte rounded-xl shadow-2xl shadow-black/80 overflow-hidden z-50">
                <div className="divide-y divide-linea max-h-80 overflow-y-auto">
                  {previewMatches.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handlePickGame(g)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-panel2 text-left transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GameCover
                          name={g.name}
                          consoleName={g.console}
                          imageUrl={g.imageUrl}
                          variant="thumb"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold uppercase text-white truncate">
                            {g.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fondo border border-linea text-textoSuave">
                              {g.console}
                            </span>
                            {g.isOffer && (
                              <span className="text-[10px] font-bold theme-accent-text uppercase">
                                🔥 Oferta
                              </span>
                            )}
                            {!g.isOffer && g.isPreorder && (
                              <span className="text-[10px] font-bold text-amber-400 uppercase">
                                ⚡ Preventa
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-white">
                          {formatMoney(g.minPrice)}
                        </div>
                        <div className="text-[9px] font-semibold text-verdeVivo uppercase">
                          Desde
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="w-full py-2.5 px-4 bg-panel2 hover:bg-[var(--accent)] text-center text-xs font-extrabold uppercase tracking-wider text-texto hover:text-white transition"
                >
                  VER LOS {totalMatchCount} RESULTADOS PARA «
                  {trimmedQuery.toUpperCase()}» →
                </button>
              </div>
            )}
          </div>

          {/* Right Section: Theme Toggle + Carrito */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Header Switcher Pill (desktop & tablet) */}
            <ThemeToggle variant="header" className="hidden sm:inline-flex" />

            {/* Botón Carrito (Abre Drawer) */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Abrir carrito"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-panel2 border border-linea hover:border-accent flex items-center justify-center text-texto hover:text-white transition shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full theme-badge text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. SUB-NAVBAR DE CATEGORÍAS */}
        <nav className="border-t border-linea bg-fondo" aria-label="Categorías">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto py-2.5 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider whitespace-nowrap">
              {navItems.map((item) => {
                const isActive = activeFilter === item.key && isControlled;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavFilter(item.key)}
                    className={`pb-1 border-b-2 transition ${
                      isActive
                        ? 'text-white border-[var(--accent)]'
                        : `${item.accent || 'text-textoSuave'} hover:text-white border-transparent`
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {isControlled ? (
                <a
                  href="#ofertas-destacadas"
                  className="text-textoSuave hover:text-white pb-1 border-b-2 border-transparent transition"
                >
                  Más Buscados
                </a>
              ) : (
                <Link
                  href="/#ofertas-destacadas"
                  className="text-textoSuave hover:text-white pb-1 border-b-2 border-transparent transition"
                >
                  Más Buscados
                </Link>
              )}

              <a
                href="#como-funciona"
                className="text-verdeVivo hover:text-white pb-1 border-b-2 border-transparent transition"
              >
                Primaria vs Secundaria
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
