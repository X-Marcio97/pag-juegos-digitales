import type { StoreConfig } from '@/types/game';

export const SHEET_ID =
  process.env.GOOGLE_SHEET_ID || '1R3u-VPzH_dyWg7eNvIbkZv2dlczr8iT8';

export const SHEET_GID = process.env.GOOGLE_SHEET_GID || '973457218';

export const CONFIG_SHEET_NAME = process.env.GOOGLE_CONFIG_SHEET || 'CONFIG';

export const CATALOG_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

export const CONFIG_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(CONFIG_SHEET_NAME)}`;

export const CATALOG_CACHE_TAG = 'catalog';
export const CATALOG_REVALIDATE_SECONDS = 300;

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'GAME STORE',
  tagline: 'Juegos Digitales Originales',
  announcement:
    'Entrega digital en el día · Precios actualizados en vivo · PS4 & PS5',
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '5491100000000',
  hours: 'Lunes a Sábados · 10 a 21 hs',
};

const CONFIG_KEY_MAP: Record<string, keyof StoreConfig> = {
  storename: 'storeName',
  store_name: 'storeName',
  nombre: 'storeName',
  tienda: 'storeName',
  tagline: 'tagline',
  subtitulo: 'tagline',
  slogan: 'tagline',
  announcement: 'announcement',
  anuncio: 'announcement',
  banner: 'announcement',
  whatsappphone: 'whatsappPhone',
  whatsapp_phone: 'whatsappPhone',
  whatsapp: 'whatsappPhone',
  telefono: 'whatsappPhone',
  hours: 'hours',
  horarios: 'hours',
  horario: 'hours',
};

/**
 * Safely parses an optional Google Sheets CONFIG tab (key/value columns A & B).
 * Google Sheets returns the first tab when a requested sheet name does not exist,
 * so we guard against accidentally parsing the main games catalog as config.
 */
export function parseConfigRows(rows: string[][]): StoreConfig {
  if (!rows || rows.length === 0) {
    return { ...DEFAULT_STORE_CONFIG };
  }

  // Guard: if the returned CSV is actually the main catalog sheet, ignore it.
  const firstRowJoined = (rows[0] || []).join(' ').toUpperCase();
  if (
    firstRowJoined.includes('JUEGO') &&
    (firstRowJoined.includes('CONSOLA') || firstRowJoined.includes('PRECIO'))
  ) {
    return { ...DEFAULT_STORE_CONFIG };
  }

  const merged: StoreConfig = { ...DEFAULT_STORE_CONFIG };
  let matchedAny = false;

  for (const row of rows) {
    const rawKey = (row[0] || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '');
    const rawVal = (row[1] || '').trim();

    if (!rawKey || !rawVal) continue;

    const targetField = CONFIG_KEY_MAP[rawKey];
    if (targetField) {
      merged[targetField] =
        targetField === 'whatsappPhone'
          ? rawVal.replace(/[^0-9]/g, '') || DEFAULT_STORE_CONFIG.whatsappPhone
          : rawVal;
      matchedAny = true;
    }
  }

  return matchedAny ? merged : { ...DEFAULT_STORE_CONFIG };
}
