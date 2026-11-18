'use client';

import Link from 'next/link';
import type { CatalogFilter, StoreConfig } from '@/types/game';
import { useCart } from './CartProvider';
import { useTheme } from './ThemeProvider';
import { buildGeneralWaLink, DEFAULT_STORE_CONFIG } from './format';

interface FooterProps {
  config?: StoreConfig;
  onSelectFilter?: (filter: CatalogFilter) => void;
}

export default function Footer({
  config = DEFAULT_STORE_CONFIG,
  onSelectFilter,
}: FooterProps) {
  const { openCart } = useCart();
  const { logoSrc } = useTheme();
  const waHref = buildGeneralWaLink(config.whatsappPhone);

  const renderFilterItem = (label: string, filter: CatalogFilter) => {
    if (onSelectFilter) {
      return (
        <button
          type="button"
          onClick={() => onSelectFilter(filter)}
          className="hover:text-[var(--accent)] transition text-left"
        >
          {label}
        </button>
      );
    }
    return (
      <Link
        href={filter === 'ALL' ? '/#catalogo' : `/?filter=${filter}#catalogo`}
        className="hover:text-[var(--accent)] transition"
      >
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-panel border-t border-linea text-xs text-textoSuave w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Columna 1: Marca con Logo dinámico */}
        <div className="space-y-3">
          <div className="relative h-10 w-auto flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={config.storeName || 'INTERGAMES ROSARIO'}
              className="h-9 sm:h-10 w-auto max-w-[190px] object-contain drop-shadow-[0_2px_8px_var(--accent-glow)] transition-all duration-300"
            />
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Venta de juegos digitales originales para PlayStation 4 y PlayStation
            5. Precios sincronizados en vivo todos los días.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-verdeVivo">
            <span className="w-2 h-2 rounded-full bg-verdeVivo animate-pulse" />
            Catálogo conectado en tiempo real
          </div>
        </div>

        {/* Columna 2: Categorías */}
        <div>
          <h4 className="section-heading text-xs font-black uppercase tracking-wider text-white mb-4">
            Catálogo
          </h4>
          <ul className="space-y-2.5">
            <li>{renderFilterItem('Juegos PlayStation 5', 'PS5')}</li>
            <li>{renderFilterItem('Juegos PlayStation 4', 'PS4')}</li>
            <li>
              {renderFilterItem('Ofertas por tiempo limitado', 'OFERTAS')}
            </li>
            <li>{renderFilterItem('Preventas y estrenos', 'PREVENTAS')}</li>
          </ul>
        </div>

        {/* Columna 3: Contacto & Pagos */}
        <div>
          <h4 className="section-heading text-xs font-black uppercase tracking-wider text-white mb-4">
            Contacto &amp; Pagos
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wa font-bold hover:underline"
              >
                WhatsApp Atención Directa
              </a>
            </li>
            <li className="text-muted">Horarios: {config.hours}</li>
          </ul>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <span className="px-2.5 py-1 rounded bg-panel2 border border-linea text-[10px] font-bold uppercase text-white">
              Transferencia
            </span>
            <span className="px-2.5 py-1 rounded bg-panel2 border border-linea text-[10px] font-bold uppercase text-white">
              Mercado Pago
            </span>
            <span className="px-2.5 py-1 rounded bg-panel2 border border-linea text-[10px] font-bold uppercase text-white">
              Efectivo
            </span>
          </div>
        </div>

        {/* Columna 4: Ayuda */}
        <div>
          <h4 className="section-heading text-xs font-black uppercase tracking-wider text-white mb-4">
            Ayuda
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#como-funciona" className="hover:text-rojoVivo transition">
                Diferencia Primaria y Secundaria
              </a>
            </li>
            <li>
              <Link href="/#catalogo" className="hover:text-rojoVivo transition">
                Cómo comprar paso a paso
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openCart}
                className="hover:text-rojoVivo transition"
              >
                Ver mi pedido actual
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-linea py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted">
          <span>© 2026 Digital GameStore · Todos los derechos reservados.</span>
          <span>Catálogo profesional sincronizado en vivo con Google Sheets</span>
        </div>
      </div>
    </footer>
  );
}
