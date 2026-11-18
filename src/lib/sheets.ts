import type {
  CatalogFilter,
  CatalogResponse,
  CatalogSort,
  CatalogStats,
  Game,
  GameDetailResponse,
  StoreConfig,
} from '@/types/game';
import {
  CATALOG_CACHE_TAG,
  CATALOG_CSV_URL,
  CATALOG_REVALIDATE_SECONDS,
  CONFIG_CSV_URL,
  DEFAULT_STORE_CONFIG,
  parseConfigRows,
} from './config';
import { fetchRawgCover, resolveCoverUrl } from './covers';

export interface FullCatalogData {
  games: Game[];
  stats: CatalogStats;
  config: StoreConfig;
  updatedAt: string;
}

export interface QueryCatalogParams {
  q?: string;
  console?: string;
  filter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ParsedSnapshot {
  rawCatalogCsv: string;
  rawConfigCsv: string;
  data: FullCatalogData;
}

let parsedSnapshot: ParsedSnapshot | null = null;
let fallbackCatalog: FullCatalogData | null = null;

export function clearCatalogMemoryCache(): void {
  parsedSnapshot = null;
}

/**
 * RFC-4180 compliant CSV parser handling quoted fields, escaped quotes (""),
 * embedded commas, and CRLF/LF line endings.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const cleanText = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];

    if (inQuotes) {
      if (ch === '"') {
        if (cleanText[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field.trim());
      field = '';
    } else if (ch === '\r') {
      if (cleanText[i + 1] === '\n') {
        i++;
      }
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
    } else if (ch === '\n') {
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function slugifySegment(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateUniqueSlug(
  name: string,
  consoleName: string,
  usedSlugs: Set<string>
): string {
  const baseName = slugifySegment(name) || 'juego';
  const baseConsole = slugifySegment(consoleName);
  const base =
    baseConsole && !baseName.endsWith(`-${baseConsole}`)
      ? `${baseName}-${baseConsole}`
      : baseName;

  if (!usedSlugs.has(base)) {
    usedSlugs.add(base);
    return base;
  }

  let counter = 2;
  while (usedSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  const unique = `${base}-${counter}`;
  usedSlugs.add(unique);
  return unique;
}

interface RawGameBuilder {
  id: number;
  slug: string;
  name: string;
  console: string;
  observation: string;
  sheetImageUrl: string;
  isOffer: boolean;
  isPreorder: boolean;
  options: Array<{ type: string; price: number }>;
}

function processCatalogRows(rows: string[][]): {
  games: Game[];
  stats: CatalogStats;
} {
  if (rows.length < 2) {
    return {
      games: [],
      stats: {
        totalGames: 0,
        ps5Count: 0,
        ps4Count: 0,
        offersCount: 0,
        preordersCount: 0,
      },
    };
  }

  const gamesMap = new Map<string, RawGameBuilder>();
  const usedSlugs = new Set<string>();
  let lastGameName = '';
  let lastConsole = '';
  let idSeq = 1;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    let gameName = (r[0] || '').trim();
    let consoleName = (r[1] || '').trim().toUpperCase();
    const accountType = (r[2] || '').trim().toUpperCase() || 'PRIMARIA';
    const priceStr = (r[3] || '').trim();
    const observation = (r[4] || '').trim();
    const sheetImageUrl = (r[5] || '').trim();

    if (gameName) {
      lastGameName = gameName;
    } else {
      gameName = lastGameName;
    }

    if (consoleName) {
      lastConsole = consoleName;
    } else {
      consoleName = lastConsole;
    }

    if (!gameName || !priceStr) continue;

    const cleanPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    if (cleanPrice <= 0) continue;

    const resolvedConsole = consoleName || 'PS5';
    const key = `${gameName.toUpperCase()}___${resolvedConsole}`;

    if (!gamesMap.has(key)) {
      const lowerObs = observation.toLowerCase();
      const lowerName = gameName.toLowerCase();
      gamesMap.set(key, {
        id: idSeq++,
        slug: generateUniqueSlug(gameName, resolvedConsole, usedSlugs),
        name: gameName,
        console: resolvedConsole,
        observation,
        sheetImageUrl,
        isOffer: lowerObs.includes('oferta'),
        isPreorder:
          lowerName.includes('preventa') || lowerObs.includes('preventa'),
        options: [],
      });
    }

    const entry = gamesMap.get(key)!;

    if (observation) {
      if (!entry.observation) {
        entry.observation = observation;
      }
      if (observation.toLowerCase().includes('oferta')) {
        entry.isOffer = true;
      }
      if (observation.toLowerCase().includes('preventa')) {
        entry.isPreorder = true;
      }
    }

    if (sheetImageUrl && !entry.sheetImageUrl) {
      entry.sheetImageUrl = sheetImageUrl;
    }

    const existingOpt = entry.options.find((o) => o.type === accountType);
    if (existingOpt) {
      existingOpt.price = cleanPrice;
    } else {
      entry.options.push({
        type: accountType,
        price: cleanPrice,
      });
    }
  }

  const games: Game[] = Array.from(gamesMap.values()).map((entry) => {
    // Keep PRIMARIA first when both Primaria and Secundaria exist
    entry.options.sort((a, b) => {
      const aPri = a.type.includes('PRIMARIA') ? 0 : 1;
      const bPri = b.type.includes('PRIMARIA') ? 0 : 1;
      return aPri - bPri;
    });

    const primaryOpt =
      entry.options.find((o) => o.type.includes('PRIMARIA')) ||
      entry.options[0];
    const minPrice = Math.min(...entry.options.map((o) => o.price));

    return {
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      console: entry.console,
      observation: entry.observation,
      imageUrl: resolveCoverUrl(entry.name, entry.sheetImageUrl),
      isOffer: entry.isOffer,
      isPreorder: entry.isPreorder,
      options: entry.options,
      minPrice,
      primaryPrice: primaryOpt ? primaryOpt.price : minPrice,
    };
  });

  const stats: CatalogStats = {
    totalGames: games.length,
    ps5Count: games.filter((g) => g.console.includes('PS5')).length,
    ps4Count: games.filter((g) => g.console.includes('PS4')).length,
    offersCount: games.filter((g) => g.isOffer).length,
    preordersCount: games.filter((g) => g.isPreorder).length,
  };

  return { games, stats };
}

async function fetchOptionalConfigCsv(): Promise<string> {
  try {
    const res = await fetch(CONFIG_CSV_URL, {
      next: {
        revalidate: CATALOG_REVALIDATE_SECONDS,
        tags: [CATALOG_CACHE_TAG],
      },
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

/**
 * Fetches and parses the full Google Sheets catalog + optional CONFIG tab.
 * Uses Next.js Data Cache (revalidate: 300s, tag: 'catalog') plus an in-memory
 * resilience fallback cache.
 */
export async function getFullCatalog(): Promise<FullCatalogData> {
  try {
    const [catalogRes, rawConfigCsv] = await Promise.all([
      fetch(CATALOG_CSV_URL, {
        next: {
          revalidate: CATALOG_REVALIDATE_SECONDS,
          tags: [CATALOG_CACHE_TAG],
        },
      }),
      fetchOptionalConfigCsv(),
    ]);

    if (!catalogRes.ok) {
      throw new Error(
        `Google Sheets respondió con HTTP ${catalogRes.status}`
      );
    }

    const rawCatalogCsv = await catalogRes.text();

    if (
      parsedSnapshot &&
      parsedSnapshot.rawCatalogCsv === rawCatalogCsv &&
      parsedSnapshot.rawConfigCsv === rawConfigCsv
    ) {
      return parsedSnapshot.data;
    }

    const catalogRows = parseCSV(rawCatalogCsv);
    const { games, stats } = processCatalogRows(catalogRows);

    const config: StoreConfig = rawConfigCsv
      ? parseConfigRows(parseCSV(rawConfigCsv))
      : { ...DEFAULT_STORE_CONFIG };

    const data: FullCatalogData = {
      games,
      stats,
      config,
      updatedAt: new Date().toISOString(),
    };

    parsedSnapshot = { rawCatalogCsv, rawConfigCsv, data };
    fallbackCatalog = data;

    return data;
  } catch (error) {
    if (fallbackCatalog) {
      return fallbackCatalog;
    }
    throw error;
  }
}

const VALID_FILTERS = new Set<CatalogFilter>([
  'ALL',
  'PS5',
  'PS4',
  'OFERTAS',
  'PREVENTAS',
]);

const VALID_SORTS = new Set<CatalogSort>([
  'DEFAULT',
  'PRICE_ASC',
  'PRICE_DESC',
  'NAME_ASC',
]);

/**
 * Filters, sorts, and paginates the catalog for API routes and Server Components.
 */
export async function queryCatalog(
  params: QueryCatalogParams = {}
): Promise<CatalogResponse> {
  const { games, stats, config, updatedAt } = await getFullCatalog();

  const rawFilter = (params.filter || 'ALL').toUpperCase() as CatalogFilter;
  const activeFilter: CatalogFilter = VALID_FILTERS.has(rawFilter)
    ? rawFilter
    : 'ALL';

  const rawConsole = (params.console || '').toUpperCase().trim();
  const rawSort = (params.sort || 'DEFAULT').toUpperCase() as CatalogSort;
  const activeSort: CatalogSort = VALID_SORTS.has(rawSort)
    ? rawSort
    : 'DEFAULT';

  const normalizedQuery = params.q ? normalizeSearchText(params.q) : '';

  const pageNum = Number.isFinite(params.page)
    ? Math.max(1, Math.floor(params.page!))
    : 1;
  const limitNum = Number.isFinite(params.limit)
    ? Math.min(1000, Math.max(1, Math.floor(params.limit!)))
    : 24;

  let filtered = games.filter((g) => {
    if (activeFilter === 'PS5' && !g.console.includes('PS5')) return false;
    if (activeFilter === 'PS4' && !g.console.includes('PS4')) return false;
    if (activeFilter === 'OFERTAS' && !g.isOffer) return false;
    if (activeFilter === 'PREVENTAS' && !g.isPreorder) return false;

    if (rawConsole && rawConsole !== 'ALL') {
      if (!g.console.includes(rawConsole)) return false;
    }

    if (normalizedQuery) {
      const nameMatch = normalizeSearchText(g.name).includes(normalizedQuery);
      const consoleMatch = normalizeSearchText(g.console).includes(
        normalizedQuery
      );
      const obsMatch = normalizeSearchText(g.observation).includes(
        normalizedQuery
      );
      if (!nameMatch && !consoleMatch && !obsMatch) return false;
    }

    return true;
  });

  if (activeSort !== 'DEFAULT') {
    filtered = [...filtered];
    if (activeSort === 'PRICE_ASC') {
      filtered.sort((a, b) => a.minPrice - b.minPrice);
    } else if (activeSort === 'PRICE_DESC') {
      filtered.sort((a, b) => b.primaryPrice - a.primaryPrice);
    } else if (activeSort === 'NAME_ASC') {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      );
    }
  }

  const totalFiltered = filtered.length;
  const start = (pageNum - 1) * limitNum;
  const paginatedGames = filtered.slice(start, start + limitNum);
  const hasMore = start + paginatedGames.length < totalFiltered;

  return {
    games: paginatedGames,
    stats,
    config,
    updatedAt,
    totalFiltered,
    page: pageNum,
    limit: limitNum,
    hasMore,
  };
}

function getFranchiseTokens(name: string): string[] {
  const stopWords = new Set([
    'the',
    'of',
    'and',
    'edition',
    'edicion',
    'definitive',
    'remastered',
    'remake',
    'ultimate',
    'standard',
    'deluxe',
    'gold',
    'goty',
    'complete',
    'collection',
    'preventa',
    'part',
    'parte',
    'ps4',
    'ps5',
  ]);
  return normalizeSearchText(name)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));
}

/**
 * Looks up a single game by slug and returns up to 8 related games.
 */
export async function getGameBySlug(
  slug: string
): Promise<GameDetailResponse | null> {
  const cleanSlug = decodeURIComponent(slug || '')
    .trim()
    .toLowerCase();
  if (!cleanSlug) return null;

  const { games, config } = await getFullCatalog();
  const found = games.find((g) => g.slug === cleanSlug);
  if (!found) return null;

  let game = found;

  // Optional RAWG enrichment on detail page if RAWG_API_KEY is configured and no cover yet
  if (!game.imageUrl && process.env.RAWG_API_KEY) {
    const rawgImg = await fetchRawgCover(game.name);
    if (rawgImg) {
      game = { ...game, imageUrl: rawgImg };
    }
  }

  const targetTokens = new Set(getFranchiseTokens(game.name));

  const scoredRelated = games
    .filter((candidate) => candidate.slug !== game.slug)
    .map((candidate) => {
      let score = 0;

      // Strong boost for shared franchise/title keywords (e.g. GTA 5 PS4 <-> GTA 5 PS5, Resident Evil series)
      const candTokens = getFranchiseTokens(candidate.name);
      for (const tok of candTokens) {
        if (targetTokens.has(tok)) {
          score += 5;
        }
      }

      // Same console boost
      if (candidate.console === game.console) {
        score += 3;
      }

      // Prefer games with offers or cover artwork when breaking ties
      if (candidate.isOffer) score += 1;
      if (candidate.imageUrl) score += 1;

      // Closer price range boost
      const priceDiff = Math.abs(candidate.minPrice - game.minPrice);
      if (priceDiff <= 10000) score += 1;

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.id - b.candidate.id)
    .slice(0, 8)
    .map((item) => item.candidate);

  return {
    game,
    related: scoredRelated,
    config,
  };
}
