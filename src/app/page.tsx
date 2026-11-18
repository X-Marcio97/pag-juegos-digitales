import CatalogClient from '@/components/CatalogClient';
import { getFullCatalog } from '@/lib/sheets';

export const revalidate = 300;

export default async function HomePage() {
  const { games, stats, config, updatedAt } = await getFullCatalog();

  return (
    <CatalogClient
      initialGames={games}
      initialStats={stats}
      config={config}
      updatedAt={updatedAt}
    />
  );
}
