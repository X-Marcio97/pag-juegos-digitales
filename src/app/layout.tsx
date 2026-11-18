import type { Metadata, Viewport } from 'next';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/components/CartProvider';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import './globals.css';

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
    <html lang="es" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-fondo text-texto antialiased selection:bg-rojo selection:text-white">
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
