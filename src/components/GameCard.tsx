'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Game } from '@/types/game';
import { useCart } from './CartProvider';
import GameCover from './GameCover';
import {
  buildSingleWaLink,
  formatMoney,
  formatOptionLabel,
  getDefaultOptionIndex,
} from './format';

interface GameCardProps {
  game: Game;
  whatsappPhone?: string;
  onQuickView?: (game: Game) => void;
}

export default function GameCard({
  game,
  whatsappPhone,
  onQuickView,
}: GameCardProps) {
  const { addToCart, whatsappPhone: ctxPhone } = useCart();
  const [selectedIdx, setSelectedIdx] = useState<number>(() =>
    getDefaultOptionIndex(game.options)
  );

  const currentOpt = game.options[selectedIdx] || game.options[0] || {
    type: 'PRIMARIA',
    price: game.minPrice,
  };
  const phone = whatsappPhone || ctxPhone;
  const waHref = buildSingleWaLink(phone, game, currentOpt);

  const handleOpenCover = () => {
    if (onQuickView) {
      onQuickView(game);
    }
  };

  return (
    <article className="game-card rounded-xl overflow-hidden flex flex-col justify-between group">
      {/* Marco superior blanco con corte biselado */}
      <div className="relative bg-white corte-foto h-44 p-3 flex items-center justify-center">
        {onQuickView ? (
          <button
            type="button"
            onClick={handleOpenCover}
            aria-label={`Vista rápida de ${game.name}`}
            className="w-full h-full block text-left focus:outline-none"
          >
            <GameCover
              name={game.name}
              consoleName={game.console}
              imageUrl={game.imageUrl}
              variant="card"
            />
          </button>
        ) : (
          <Link
            href={`/juego/${game.slug}`}
            className="w-full h-full block focus:outline-none"
          >
            <GameCover
              name={game.name}
              consoleName={game.console}
              imageUrl={game.imageUrl}
              variant="card"
            />
          </Link>
        )}

        {/* Badges flotantes */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-fondo/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
            {game.console}
          </span>
        </div>

        {game.isOffer ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-rojo text-white text-[9px] font-black uppercase tracking-wider shadow-md z-10 pointer-events-none">
            🔥 OFERTA
          </span>
        ) : game.isPreorder ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-md z-10 pointer-events-none">
            ⚡ PREVENTA
          </span>
        ) : null}

        {/* Pill Quick View en hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleOpenCover}
            className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 focus:opacity-100 px-2.5 py-1 rounded bg-fondo/90 hover:bg-rojo text-white text-[9px] font-extrabold uppercase tracking-wider shadow transition z-10"
          >
            Vista rápida
          </button>
        )}
      </div>

      {/* Cuerpo de información */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rojoVivo truncate">
              {game.isOffer
                ? 'OFERTA POR TIEMPO LIMITADO'
                : game.isPreorder
                  ? 'PREVENTA EXCLUSIVA'
                  : 'ENTREGA DIGITAL'}
            </span>
            <Link
              href={`/juego/${game.slug}`}
              className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-white transition shrink-0"
              title="Abrir página del juego"
            >
              Ver →
            </Link>
          </div>

          <h3
            className="text-xs sm:text-[13px] font-extrabold uppercase text-texto group-hover:text-white leading-snug line-clamp-2 min-h-[2.4em]"
            title={game.name}
          >
            <Link
              href={`/juego/${game.slug}`}
              className="hover:text-rojoVivo transition"
            >
              {game.name}
            </Link>
          </h3>

          {/* Selector Primaria / Secundaria */}
          <div className="flex items-center gap-1.5 mt-3">
            {game.options.map((opt, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={`${opt.type}-${idx}`}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-extrabold uppercase tracking-wider border transition ${
                    active
                      ? 'bg-rojo border-rojo text-white'
                      : 'bg-panel2 border-linea text-muted hover:border-lineaFuerte hover:text-white'
                  }`}
                >
                  {formatOptionLabel(opt.type)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Precio + CTA */}
        <div className="mt-4 pt-3 border-t border-linea flex items-end justify-between gap-2">
          <div>
            <div className="text-xl font-black text-white tracking-tight leading-none">
              {formatMoney(currentOpt.price)}
            </div>
            <div className="text-[10px] font-bold text-verdeVivo mt-1">
              Transferencia / MP
            </div>
          </div>

          {/* Botones de acción: WhatsApp Directo + Carrito Rojo */}
          <div className="flex items-center gap-1.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Pedir directo por WhatsApp"
              aria-label={`Pedir ${game.name} por WhatsApp`}
              className="w-9 h-9 rounded-lg bg-panel2 border border-linea hover:border-wa hover:bg-wa text-wa hover:text-white flex items-center justify-center transition"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => addToCart(game, currentOpt)}
              title="Agregar al pedido"
              aria-label={`Agregar ${game.name} al pedido`}
              className="w-9 h-9 rounded-lg bg-rojo hover:bg-rojoVivo text-white flex items-center justify-center shadow-md shadow-rojo/25 transition active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
