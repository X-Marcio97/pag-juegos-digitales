export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="bg-panel border border-linea rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-linea">
        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Entrega Inmediata
            </h3>
            <p className="text-xs text-textoSuave mt-1 leading-relaxed">
              Coordinás por WhatsApp y recibís tu juego digital hoy mismo.
            </p>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              100% Originales
            </h3>
            <p className="text-xs text-textoSuave mt-1 leading-relaxed">
              Juegos oficiales descargados directo desde PlayStation Store.
            </p>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Medios de Pago
            </h3>
            <p className="text-xs text-textoSuave mt-1 leading-relaxed">
              Transferencia bancaria, Mercado Pago y efectivo.
            </p>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors">
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Soporte Paso a Paso
            </h3>
            <p className="text-xs text-textoSuave mt-1 leading-relaxed">
              Te guiamos en todo el proceso de descarga e instalación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
