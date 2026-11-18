export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-t border-linea bg-panel/60 py-12 scroll-mt-24 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading text-lg sm:text-xl font-black italic uppercase tracking-wide text-white mb-6">
          ¿Primaria o Secundaria? Cómo funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cuenta Primaria */}
          <div className="bg-panel border border-linea rounded-xl p-6 hover:border-rojo/60 transition">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded bg-rojo/15 border border-rojo/40 text-rojoVivo text-xs font-black uppercase tracking-wider">
                Cuenta Primaria
              </span>
              <span className="text-xs font-bold text-verdeVivo">
                ★ LA MÁS ELEGIDA
              </span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-textoSuave">
              <li>
                • Jugás siempre desde{' '}
                <strong className="text-white">tu propio usuario personal</strong>{' '}
                de PlayStation.
              </li>
              <li>
                • Todos los trofeos y partidas guardadas quedan en tu perfil.
              </li>
              <li>
                • Podés jugar{' '}
                <strong className="text-white">
                  con o sin conexión a internet
                </strong>
                .
              </li>
            </ul>
          </div>

          {/* Cuenta Secundaria */}
          <div className="bg-panel border border-linea rounded-xl p-6 hover:border-verdeGeek/60 transition">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded bg-verdeGeek/15 border border-verdeGeek/40 text-verdeVivo text-xs font-black uppercase tracking-wider">
                Cuenta Secundaria
              </span>
              <span className="text-xs font-bold text-muted">
                💰 MÁS ECONÓMICA
              </span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-textoSuave">
              <li>
                • El juego completo y original, pero a un{' '}
                <strong className="text-white">precio mucho menor</strong>.
              </li>
              <li>
                • Jugás ingresando directamente desde el usuario que te enviamos.
              </li>
              <li>
                • Requiere conexión a internet activa para verificar la licencia.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
