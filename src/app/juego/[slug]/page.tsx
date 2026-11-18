import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import GameDetailClient from '@/components/GameDetailClient';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import TrustStrip from '@/components/TrustStrip';
import { formatMoney } from '@/components/format';
import { getGameBySlug } from '@/lib/sheets';

export const revalidate = 300;

interface GamePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const data = await getGameBySlug(params.slug);
  if (!data) {
    return {
      title: 'Juego no encontrado',
      description: 'El título buscado no se encuentra disponible en el catálogo.',
    };
  }

  const { game, config } = data;
  const priceLabel = formatMoney(game.minPrice);
  const title = `${game.name} (${game.console}) Digital`;
  const description = `Comprá ${game.name} para ${game.console} desde ${priceLabel} en ${config.storeName}. Cuenta Primaria o Secundaria 100% original con entrega digital en el día por WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | THE BEST DIGITAL`,
      description,
      type: 'website',
      locale: 'es_AR',
      images: game.imageUrl ? [{ url: game.imageUrl, alt: game.name }] : undefined,
    },
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const data = await getGameBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { game, related, config } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} />
      <GameDetailClient game={game} related={related} config={config} />
      <HowItWorks />
      <TrustStrip />
      <Footer config={config} />
    </div>
  );
}
