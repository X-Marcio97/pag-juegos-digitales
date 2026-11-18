'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Game, StoreConfig } from '@/types/game';
import { useCart } from './CartProvider';
import GameCard from './GameCard';
import GameCover from './GameCover';
import {
  buildSingleWaLink,
  formatMoney,
  formatOptionLabel,
  getDefaultOptionIndex,
} from './format';

interface GameDetailClientProps {
  game: Game;
  related: Game[];
  config: StoreConfig;
}

export default function GameDetailClient({
  game,
  related,
  config,
}: GameDetailClientProps) {
  const { addToCart, showToast, setWhatsappPhone } = useCart();
  const [selectedIdx, setSelectedIdx] = useState<number>(() =>
    getDefaultOptionIndex(game.options)
  );

  useEffect(() => {
    if (config.whatsappPhone) {
      setWhatsappPhone(config.whatsappPhone);
    }
  }, [config.whatsappPhone, setWhatsappPhone]);

  const currentOpt = game.options[selectedIdx] || game.options[0] || {
    type: 'PRIMARIA',
    price: game.minPrice,
  };
  const isSecundaria = currentOpt.type.toUpperCase().includes('SECUNDARIA');
  const waHref = buildSingleWaLink(config.whatsappPhone, game, currentOpt);

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/juego/${game.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copiado para compartir');
    } catch {
      showToast(`Link: /juego/${game.slug}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      {/* Breadcrumb */}
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-muted mb-6"
      >
        <Link href="/" className="hover:text-white transition">
          Inicio
        </Link>
        <span>/</span>
        <Link
          href={`/?filter=${game.console.includes('PS5') ? 'PS5' : game.console.includes('PS4') ? 'PS4' : 'ALL'}#catalogo`}
          className="hover:text-white transition"
        >
          {game.console}
        </Link>
        <span>/</span>
        <span className="text-rojoVivo truncate max-w-xs sm:max-w-md">
          {game.name}
        </span>
      </nav>

      {/* Product Showcase Grid */}
      <div className="bg-panel border border-linea rounded-2xl p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start shadow-2xl shadow-black/50">
        {/* Left: Cover Showcase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative bg-white corte-foto h-72 sm:h-96 p-4 rounded-xl flex items-center justify-center shadow-xl">
            <GameCover
              name={game.name}
              consoleName={game.console}
              imageUrl={game.imageUrl}
              variant="detail"
            />
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-fondo/90 text-white text-xs font-black uppercase tracking-wider shadow">
              {game.console}
            </span>
            {game.isOffer ? (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-rojo text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                🔥 OFERTA
              </span>
            ) : game.isPreorder ? (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                ⚡ PREVENTA
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-panel2 border border-linea rounded-xl p-3">
              <div className="text-[10px] font-black uppercase text-rojoVivo">
                100% Original
              </div>
              <div className="text-[10px] text-muted mt-0.5">PS Store</div>
            </div>
            <div className="bg-panel2 border border-linea rounded-xl p-3">
              <div className="text-[10px] font-black uppercase text-verdeVivo">
                Entrega Hoy
              </div>
              <div className="text-[10px] text-muted mt-0.5">Digital</div>
            </div>
            <div className="bg-panel2 border border-linea rounded-xl p-3">
              <div className="text-[10px] font-black uppercase text-white">
                Garantía
              </div>
              <div className="text-[10px] text-muted mt-0.5">Soporte WA</div>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase Box */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-rojo/40 bg-rojo/10 text-[10px] font-extrabold uppercase tracking-widest text-rojoVivo">
              {game.isOffer
                ? '🔥 OFERTA POR TIEMPO LIMITADO'
                : game.isPreorder
                  ? '⚡ PREVENTA EXCLUSIVA'
                  : '⚡ ENTREGA DIGITAL INMEDIATA'}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white leading-tight mt-3">
              {game.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-md bg-panel2 border border-linea text-xs font-extrabold uppercase text-white">
                Consola: {game.console}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-verdeGeek/10 border border-verdeGeek/30 text-xs font-bold text-verdeVivo">
                Stock disponible en vivo
              </span>
            </div>

            {game.observation && (
              <div className="mt-4 bg-panel2 border border-linea rounded-xl p-3.5 text-xs text-textoSuave">
                <span className="font-extrabold uppercase tracking-wider text-white mr-1.5">
                  Observación:
                </span>
                {game.observation}
              </div>
            )}
          </div>

          {/* Switcher Primaria / Secundaria */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-muted mb-2.5">
              Seleccioná modalidad de cuenta
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.options.map((opt, idx) => {
                const active = idx === selectedIdx;
                const label = formatOptionLabel(opt.type);
                const isSec = opt.type.toUpperCase().includes('SECUNDARIA');
                return (
                  <button
                    key={`${opt.type}-${idx}`}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-4 rounded-xl border text-left transition ${
                      active
                        ? 'bg-rojo/15 border-rojo shadow-lg shadow-rojo/15'
                        : 'bg-panel2 border-linea hover:border-lineaFuerte'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        Cuenta {label}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase ${
                          isSec ? 'text-verdeVivo' : 'text-rojoVivo'
                        }`}
                      >
                        {isSec ? 'Más económica' : 'Recomendada'}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white mt-1.5">
                      {formatMoney(opt.price)}
                    </div>
                    <p className="text-[11px] text-textoSuave mt-1">
                      {isSec
                        ? 'Jugás desde la cuenta enviada con internet activo.'
                        : 'Jugás desde tu usuario personal, online u offline.'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation box for selected option */}
          <div className="bg-fondo border border-linea rounded-xl p-4 space-y-1.5 text-xs text-textoSuave">
            <div className="font-black uppercase tracking-wider text-white text-[11px]">
              ¿Qué incluye tu cuenta {formatOptionLabel(currentOpt.type)}?
            </div>
            {isSecundaria ? (
              <ul className="space-y-1">
                <li>
                  • Juego 100% original descargado directo desde PlayStation
                  Store.
                </li>
                <li>
                  • Jugás ingresando directamente al perfil que te entregamos.
                </li>
                <li>
                  • Requiere conexión a internet activa mientras jugás.
                </li>
              </ul>
            ) : (
              <ul className="space-y-1">
                <li>
                  • Jugás siempre desde{' '}
                  <strong className="text-white">
                    tu propio usuario personal
                  </strong>{' '}
                  de PlayStation.
                </li>
                <li>
                  • Todos los trofeos y partidas guardadas quedan en tu cuenta.
                </li>
                <li>
                  • Funciona{' '}
                  <strong className="text-white">
                    con o sin conexión a internet
                  </strong>{' '}
                  una vez descargado.
                </li>
              </ul>
            )}
          </div>

          {/* Price + Action Buttons */}
          <div className="pt-4 border-t border-linea space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-muted">
                  Total ({formatOptionLabel(currentOpt.type)})
                </div>
                <div className="text-4xl font-black text-white tracking-tight leading-none mt-1">
                  {formatMoney(currentOpt.price)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-extrabold text-verdeVivo">
                  Transferencia / Mercado Pago / Efectivo
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  Atención: {config.hours}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => addToCart(game, currentOpt)}
                className="corte-btn flex-1 bg-rojo hover:bg-rojoVivo text-white py-4 px-6 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-rojo/30 transition active:scale-[0.98]"
              >
                + Agregar al Pedido
              </button>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-wa hover:bg-[#3eb338] text-white py-4 px-6 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-wa/20 transition"
              >
                <svg
                  className="w-5 h-5 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" />
                </svg>
                <span>Pedir por WhatsApp →</span>
              </a>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs font-extrabold uppercase tracking-wider text-textoSuave hover:text-white transition"
              >
                🔗 Copiar link para compartir
              </button>
              <Link
                href="/#catalogo"
                className="text-xs font-extrabold uppercase tracking-wider text-rojoVivo hover:text-white transition"
              >
                ← Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="section-heading text-lg sm:text-xl font-black italic uppercase tracking-wide text-white">
              Juegos relacionados
            </h2>
            <Link
              href="/#catalogo"
              className="text-xs font-extrabold uppercase tracking-wider text-rojoVivo hover:text-white transition"
            >
              Ver catálogo completo →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((rel) => (
              <GameCard
                key={rel.id}
                game={rel}
                whatsappPhone={config.whatsappPhone}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
