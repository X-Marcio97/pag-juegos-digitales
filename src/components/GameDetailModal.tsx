'use client';

import { useEffect, useState } from 'react';
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

interface GameDetailModalProps {
  game: Game | null;
  whatsappPhone?: string;
  onClose: () => void;
}

export default function GameDetailModal({
  game,
  whatsappPhone,
  onClose,
}: GameDetailModalProps) {
  const { addToCart, showToast, whatsappPhone: ctxPhone } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (game) {
      setSelectedIdx(getDefaultOptionIndex(game.options));
    }
  }, [game]);

  useEffect(() => {
    if (!game) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game, onClose]);

  if (!game) return null;

  const currentOpt = game.options[selectedIdx] || game.options[0] || {
    type: 'PRIMARIA',
    price: game.minPrice,
  };
  const isSecundaria = currentOpt.type.toUpperCase().includes('SECUNDARIA');
  const phone = whatsappPhone || ctxPhone;
  const waHref = buildSingleWaLink(phone, game, currentOpt);

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/juego/${game.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link del juego copiado al portapapeles');
    } catch {
      showToast(`Link: /juego/${game.slug}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-panel border border-lineaFuerte rounded-2xl shadow-2xl shadow-black overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-fondo border-b border-linea flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded bg-panel2 border border-linea text-white text-[10px] font-black uppercase tracking-wider">
              {game.console}
            </span>
            {game.isOffer && (
              <span className="px-2 py-0.5 rounded bg-rojo text-white text-[10px] font-black uppercase tracking-wider">
                🔥 OFERTA
              </span>
            )}
            {!game.isOffer && game.isPreorder && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                ⚡ PREVENTA
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar vista rápida"
            className="w-8 h-8 rounded-lg bg-panel2 border border-linea hover:border-rojo text-textoSuave hover:text-white flex items-center justify-center transition shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {/* Cover */}
          <div className="sm:col-span-5">
            <div className="bg-white corte-foto h-56 sm:h-64 p-3 rounded-xl flex items-center justify-center shadow-lg">
              <GameCover
                name={game.name}
                consoleName={game.console}
                imageUrl={game.imageUrl}
                variant="detail"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex-1 py-2 px-3 rounded-lg bg-panel2 border border-linea hover:border-rojo text-[10px] font-extrabold uppercase tracking-wider text-textoSuave hover:text-white transition"
              >
                🔗 Copiar link
              </button>
              <Link
                href={`/juego/${game.slug}`}
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-lg bg-panel2 border border-linea hover:border-rojo text-[10px] font-extrabold uppercase tracking-wider text-white text-center transition"
              >
                Ver ficha →
              </Link>
            </div>
          </div>

          {/* Info & Actions */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-rojoVivo">
                {game.isOffer
                  ? 'OFERTA POR TIEMPO LIMITADO'
                  : game.isPreorder
                    ? 'PREVENTA EXCLUSIVA'
                    : 'JUEGO DIGITAL ORIGINAL'}
              </div>
              <h2
                id="quickview-title"
                className="text-xl sm:text-2xl font-black italic uppercase text-white leading-tight mt-1"
              >
                {game.name}
              </h2>

              {game.observation && (
                <p className="mt-2 text-xs text-textoSuave bg-panel2 border border-linea rounded-lg px-3 py-2">
                  <strong className="text-white uppercase text-[10px] tracking-wider mr-1.5">
                    Nota:
                  </strong>
                  {game.observation}
                </p>
              )}

              {/* Selector Primaria / Secundaria */}
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
                  Elegí el tipo de cuenta
                </div>
                <div className="flex items-center gap-2">
                  {game.options.map((opt, idx) => {
                    const active = idx === selectedIdx;
                    return (
                      <button
                        key={`${opt.type}-${idx}`}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-extrabold uppercase tracking-wider border transition ${
                          active
                            ? 'bg-rojo border-rojo text-white shadow-md shadow-rojo/25'
                            : 'bg-panel2 border-linea text-textoSuave hover:border-lineaFuerte hover:text-white'
                        }`}
                      >
                        <div>{formatOptionLabel(opt.type)}</div>
                        <div className="text-[11px] font-black opacity-90 mt-0.5">
                          {formatMoney(opt.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explicación breve de cuenta elegida */}
              <div className="mt-3 rounded-lg bg-fondo border border-linea p-3 text-[11px] text-textoSuave leading-relaxed">
                {isSecundaria ? (
                  <>
                    <strong className="text-verdeVivo uppercase">
                      Cuenta Secundaria:
                    </strong>{' '}
                    Juego completo original más económico. Jugás desde el
                    usuario que te enviamos con conexión a internet.
                  </>
                ) : (
                  <>
                    <strong className="text-rojoVivo uppercase">
                      Cuenta Primaria:
                    </strong>{' '}
                    Jugás desde tu propio usuario personal de PlayStation, con
                    tus trofeos, online u offline.
                  </>
                )}
              </div>
            </div>

            {/* Precio + CTAs */}
            <div className="pt-3 border-t border-linea space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">
                    Precio {formatOptionLabel(currentOpt.type)}
                  </span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {formatMoney(currentOpt.price)}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-verdeVivo">
                  Transferencia / MP
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(game, currentOpt);
                    onClose();
                  }}
                  className="corte-btn bg-rojo hover:bg-rojoVivo text-white py-3 px-4 text-xs font-black uppercase tracking-wider shadow-lg shadow-rojo/30 transition active:scale-[0.98]"
                >
                  + Agregar al Pedido
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-wa hover:bg-[#3eb338] text-white py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
