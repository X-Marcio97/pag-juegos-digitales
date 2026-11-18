export interface GameOption {
  type: string;
  price: number;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  console: string;
  observation: string;
  imageUrl: string;
  isOffer: boolean;
  isPreorder: boolean;
  options: GameOption[];
  minPrice: number;
  primaryPrice: number;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  announcement: string;
  whatsappPhone: string;
  hours: string;
}

export interface CatalogStats {
  totalGames: number;
  ps5Count: number;
  ps4Count: number;
  offersCount: number;
  preordersCount: number;
}

export interface CatalogResponse {
  games: Game[];
  stats: CatalogStats;
  config: StoreConfig;
  updatedAt: string;
  totalFiltered: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GameDetailResponse {
  game: Game;
  related: Game[];
  config: StoreConfig;
}

export interface CartItem {
  cartKey: string;
  gameId: number;
  slug: string;
  name: string;
  console: string;
  type: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export type CatalogFilter = 'ALL' | 'PS5' | 'PS4' | 'OFERTAS' | 'PREVENTAS';

export type CatalogSort = 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC';
