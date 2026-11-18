import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'THE BEST DIGITAL | Juegos Digitales PS4 & PS5',
    template: '%s | THE BEST DIGITAL',
  },
  description:
    'Catálogo completo de juegos digitales originales para PlayStation 4 y PlayStation 5. Precios actualizados en vivo, cuenta Primaria o Secundaria y entrega en el día por WhatsApp.',
  openGraph: {
    title: 'THE BEST DIGITAL | Juegos Digitales PS4 & PS5',
    description:
      'Juegos digitales originales para PS4 y PS5 con precios actualizados en vivo y atención directa por WhatsApp.',
    type: 'website',
    locale: 'es_AR',
  },
};

export const viewport: Viewport = {
  themeColor: '#08080a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth dark ${montserrat.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-fondo text-texto antialiased selection:bg-rojo selection:text-white">
        {/* Handed off to @frontend: wrap {children} with <CartProvider> / <AppShell> here */}
        {children}
      </body>
    </html>
  );
}
