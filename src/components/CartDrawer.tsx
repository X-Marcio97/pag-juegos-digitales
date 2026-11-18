'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import GameCover from './GameCover';
import { buildCartWaLink, formatMoney, formatOptionLabel } from './format';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    whatsappPhone,
    closeCart,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const checkoutHref =
    items.length > 0 ? buildCartWaLink(whatsappPhone, items, totalPrice) : '#';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-black/75 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Drawer */}
      <aside
        aria-label="Tu Pedido"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-panel border-l border-linea z-50 transform transition-transform duration-300 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Drawer */}
        <div className="p-5 border-b border-linea flex items-center justify-between bg-fondo">
          <h3 className="section-heading text-sm font-black italic uppercase tracking-wider text-white">
            Tu Pedido (<span>{totalItems}</span>)
          </h3>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-lg bg-panel2 border border-linea hover:border-rojo text-textoSuave hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-4xl opacity-40">🛒</div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mt-3">
                Tu pedido está vacío
              </p>
              <p className="text-[11px] text-muted/80 mt-1 max-w-xs mx-auto">
                Sumá juegos del catálogo para consultar todo junto por WhatsApp.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartKey}
                className="bg-panel2 border border-linea rounded-xl p-3.5 flex items-start gap-3"
              >
                <Link
                  href={`/juego/${item.slug}`}
                  onClick={closeCart}
                  className="shrink-0"
                >
                  <GameCover
                    name={item.name}
                    consoleName={item.console}
                    imageUrl={item.imageUrl}
                    variant="thumb"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/juego/${item.slug}`}
                      onClick={closeCart}
                      className="text-xs font-extrabold uppercase text-white hover:text-rojoVivo leading-snug line-clamp-2 transition"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartKey)}
                      className="text-muted hover:text-rojoVivo text-xs font-bold p-1 -mt-1 -mr-1 transition shrink-0"
                      title="Quitar"
                      aria-label={`Quitar ${item.name}`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fondo border border-linea text-textoSuave">
                      {item.console}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rojo/15 text-rojoVivo uppercase">
                      {formatOptionLabel(item.type)}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    {/* Quantity Controls: - 1 + */}
                    <div className="inline-flex items-center rounded-lg bg-fondo border border-linea overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementQty(item.cartKey)}
                        aria-label="Restar unidad"
                        className="w-7 h-7 flex items-center justify-center text-textoSuave hover:bg-panel2 hover:text-white text-xs font-black transition"
                      >
                        −
                      </button>
                      <span className="min-w-[26px] text-center text-xs font-black text-white">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQty(item.cartKey)}
                        aria-label="Sumar unidad"
                        className="w-7 h-7 flex items-center justify-center text-textoSuave hover:bg-panel2 hover:text-white text-xs font-black transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-black text-white">
                      {formatMoney(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Drawer */}
        <div className="p-5 border-t border-linea bg-fondo space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Total estimado
            </span>
            <span className="text-2xl font-black text-white">
              {formatMoney(totalPrice)}
            </span>
          </div>

          <a
            href={checkoutHref}
            target={items.length > 0 ? '_blank' : undefined}
            rel={items.length > 0 ? 'noopener noreferrer' : undefined}
            aria-disabled={items.length === 0}
            onClick={(e) => {
              if (items.length === 0) e.preventDefault();
            }}
            className={`corte-btn w-full flex items-center justify-center gap-2.5 bg-rojo hover:bg-rojoVivo text-white py-3.5 px-4 text-xs font-black uppercase tracking-wider shadow-lg shadow-rojo/30 transition ${
              items.length === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" />
            </svg>
            <span>Pedir todo por WhatsApp →</span>
          </a>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-[11px] font-bold uppercase tracking-wider text-muted hover:text-rojoVivo transition"
            >
              Vaciar pedido
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
