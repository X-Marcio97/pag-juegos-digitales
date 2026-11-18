import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function GameNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-rojo/15 border border-rojo/40 flex items-center justify-center text-3xl mb-5">
          🎮
        </div>
        <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
          Juego no encontrado
        </h1>
        <p className="text-sm text-textoSuave mt-3 max-w-md">
          El juego que buscás no está disponible o cambió de nombre en la
          planilla. Volvé al catálogo completo para ver todos los títulos
          disponibles.
        </p>
        <Link
          href="/#catalogo"
          className="corte-btn mt-7 inline-flex items-center gap-2 bg-rojo hover:bg-rojoVivo text-white text-xs font-black uppercase tracking-wider px-7 py-3.5 shadow-lg shadow-rojo/30 transition"
        >
          <span>← Volver al Catálogo</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
