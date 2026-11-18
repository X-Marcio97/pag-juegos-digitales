/**
 * Cover image resolution for Digital GameStore.
 *
 * Priority 1: Explicit valid http(s) URL in Google Sheet column F (IMAGEN).
 * Priority 2: Curated map of verified Steam CDN official artwork URLs
 *             matched by normalized title / keywords (handles common abbreviations
 *             and sheet typos like GOW, MK, NFS, COD, AC, HOGWATS, BATTLEFIEL, etc.).
 * Priority 3: Returns '' so the UI renders its stylized PlayStation box art fallback
 *             cleanly without ever producing broken images.
 */

const STEAM_CDN = (appId: number): string =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

interface CoverRule {
  /** Normalized phrases where ALL terms in at least one pattern array must match, or a regex. */
  match: RegExp;
  appId: number;
}

/**
 * Ordered from most specific to more general so sequels/editions resolve accurately.
 * Every Steam App ID in this list has been verified to serve HTTP 200 header.jpg artwork.
 */
const CURATED_COVER_RULES: CoverRule[] = [
  // Grand Theft Auto (avoid matching GTA 6 preorder with GTA 5 artwork)
  { match: /\bgta\s*(5|v)\b|\bgrand theft auto\s*(5|v)\b/, appId: 271590 },
  { match: /\bgta\s*trilogy\b|\bgrand theft auto.*trilogy\b/, appId: 1546970 },

  // Red Dead Redemption
  { match: /\bred dead redemption\s*2\b|\brdr\s*2\b/, appId: 1174180 },

  // EA Sports FC / FIFA
  { match: /\b(ea\s*)?fc\s*2[567]\b/, appId: 2669320 },
  { match: /\b(ea\s*)?fc\s*24\b|\bfifa\b/, appId: 2195250 },

  // Spider-Man
  { match: /\bspider\s*man\s*2\b/, appId: 2651280 },
  { match: /\bmiles morales\b/, appId: 1817190 },
  { match: /\bspider\s*man\b/, appId: 1817070 },

  // God of War
  { match: /\b(gow|god of war)\s*ragnarok\b/, appId: 2322010 },
  { match: /\b(gow|god of war)\s*4\b|\bgod of war\s*\(2018\)/, appId: 1593500 },

  // The Last of Us
  { match: /\blast of us.*(part\s*2|parte\s*2|ii)\b/, appId: 2531310 },
  { match: /\blast of us\b/, appId: 1888930 },

  // Elden Ring / FromSoftware
  { match: /\belden ring\b/, appId: 1245620 },
  { match: /\bsekiro\b/, appId: 814380 },
  { match: /\bdark souls\s*(3|iii)\b/, appId: 374320 },
  { match: /\bdark souls\s*(2|ii)\b/, appId: 335300 },
  { match: /\bdark souls\b/, appId: 570940 },

  // Cyberpunk 2077 / Witcher
  { match: /\bcyberpunk\s*2077\b/, appId: 1091500 },
  { match: /\bwitcher\s*3\b/, appId: 292030 },

  // Hogwarts Legacy (including sheet typo "HOGWATS")
  { match: /\bhogwar?ts\s*legacy\b/, appId: 990080 },

  // Resident Evil
  { match: /\bresident evil\s*4\b.*\b(2005|classic|original)\b/, appId: 254700 },
  { match: /\bresident evil\s*4\b/, appId: 2050650 },
  { match: /\bresident evil\s*2\b/, appId: 883710 },
  { match: /\bresident evil\s*3\b/, appId: 952060 },
  { match: /\bresident evil\s*remake trilogy\b/, appId: 883710 },
  { match: /\bresident evil\s*(8|village)\b/, appId: 1196590 },
  { match: /\bresident evil\s*7\b/, appId: 418370 },
  { match: /\bresident evil\s*6\b/, appId: 221040 },
  { match: /\bresident evil\s*5\b/, appId: 21690 },
  { match: /\bresident evil\s*0\b/, appId: 339340 },
  { match: /\bresident evil\s*(1|hd|origins)\b/, appId: 304240 },

  // Mortal Kombat
  { match: /\b(mk|mortal kombat)\s*11\b/, appId: 976310 },
  { match: /\b(mk|mortal kombat)\s*(x|xl)\b/, appId: 307780 },
  { match: /\b(mk|mortal kombat)\s*1\b|\bmk1\b/, appId: 1971870 },

  // Call of Duty
  { match: /\b(cod|call of duty)\s*black ops\s*6\b/, appId: 2933620 },
  { match: /\b(cod|call of duty)\s*black ops\s*cold war\b/, appId: 1985810 },
  { match: /\b(cod|call of duty)\s*black ops\s*3\b/, appId: 311210 },
  { match: /\b(cod|call of duty)\s*black ops\s*2\b/, appId: 202970 },
  { match: /\b(cod|call of duty)\s*modern warfare\s*(3|iii)\b/, appId: 2519060 },
  { match: /\b(cod|call of duty)\s*modern warfare\s*(2|ii)\b/, appId: 1938090 },
  { match: /\b(cod|call of duty)\s*modern warfare\b/, appId: 2000950 },

  // Forza / Racing
  { match: /\bforza horizon\s*5\b/, appId: 1551360 },
  { match: /\bforza horizon\s*4\b/, appId: 1293830 },
  { match: /\b(nfs|need for speed)\s*heat\b/, appId: 1222680 },
  { match: /\b(nfs|need for speed)\s*payback\b/, appId: 1262580 },
  { match: /\b(nfs|need for speed)\s*unbound\b/, appId: 1846380 },
  { match: /\bthe crew\s*motorfest\b/, appId: 2698940 },
  { match: /\bassetto corsa\b/, appId: 244210 },
  { match: /\bbeam\s*ng\b/, appId: 284160 },
  { match: /\bmx vs atv\s*legends\b/, appId: 1205970 },
  { match: /\bwrc\s*(9|10)\b/, appId: 1462810 },
  { match: /\bf1\s*2[45]\b/, appId: 2488620 },

  // Battlefield (including sheet typo "BATTLEFIEL 1")
  { match: /\bbattlefiel?d?\s*1\b/, appId: 1238840 },
  { match: /\bbattlefiel?d?\s*(5|v)\b/, appId: 1238810 },

  // Dragon Ball / Anime & Fighting
  { match: /\bdragon ball.*sparking\s*zero\b/, appId: 1790600 },
  { match: /\bdragon ball.*xenoverse\s*2\b/, appId: 454650 },
  { match: /\bdragon ball.*kakarot\b/, appId: 851850 },
  { match: /\bdragon ball.*fighterz\b/, appId: 678950 },
  { match: /\bnaruto.*storm\s*4\b/, appId: 349040 },
  { match: /\btekken\s*8\b/, appId: 1778820 },
  { match: /\bstreet fighter\s*6\b/, appId: 1364780 },
  { match: /\binjustice\s*2\b/, appId: 627270 },

  // Co-op / Party / Family / Indie
  { match: /\bit takes\s*(2|two)\b/, appId: 1426210 },
  { match: /\ba way out\b/, appId: 1222700 },
  { match: /\bgang beast/, appId: 285900 },
  { match: /\bcuphead\b/, appId: 268910 },
  { match: /\bhollow knight\b/, appId: 367520 },
  { match: /\bovercooked\s*2\b/, appId: 728880 },
  { match: /\bslime rancher\b/, appId: 433340 },
  { match: /\bstardew valley\b/, appId: 413150 },
  { match: /\bterraria\b/, appId: 105600 },
  { match: /\bsubnautica\b/, appId: 264710 },
  { match: /\bminecraft\s*dungeons\b/, appId: 1672970 },
  { match: /\brayman legends\b/, appId: 242550 },

  // Crash / Sonic / LEGO
  { match: /\bcrash bandicoot\s*4\b/, appId: 1378990 },
  { match: /\bcrash bandicoot.*(insane|n sane|trilogy)\b/, appId: 731490 },
  { match: /\bsonic superstars\b/, appId: 2022670 },
  { match: /\blego marvel.*avengers\b/, appId: 405310 },
  { match: /\blego marvel\s*super\s*heroes\b/, appId: 249130 },

  // PlayStation Studios & Action-Adventure
  { match: /\bhorizon\s*forbidden west\b/, appId: 2420110 },
  { match: /\bhorizon\s*zero dawn\b/, appId: 1151640 },
  { match: /\bghost of tsushima\b/, appId: 2215430 },
  { match: /\bdays gone\b/, appId: 1259420 },
  { match: /\buncharted.*legacy of thieves\b/, appId: 1659420 },
  { match: /\bstar?s?\s*wars\s*jedi.*survivor\b/, appId: 1774580 },
  { match: /\bstar?s?\s*wars\s*jedi.*fallen order\b/, appId: 1172380 },
  { match: /\bbatman.*arkham\b/, appId: 208650 },
  { match: /\bdevil may cry\b/, appId: 601150 },
  { match: /\brise of the tomb raider\b/, appId: 391220 },
  { match: /\bshadow of the tomb raider\b/, appId: 750920 },
  { match: /\btomb raider\b/, appId: 203160 },
  { match: /\bmetal gear solid\s*(5|v)\b/, appId: 287700 },
  { match: /\bhitman\b/, appId: 1659040 },

  // Assassin's Creed
  { match: /\b(ac|assassins? creed)\s*odyssey\b/, appId: 812140 },
  { match: /\b(ac|assassins? creed)\s*valhalla\b/, appId: 2208920 },
  { match: /\b(ac|assassins? creed)\s*mirage\b/, appId: 3035570 },
  { match: /\b(ac|assassins? creed)\s*origins\b/, appId: 582160 },
  { match: /\b(ac|assassins? creed)\s*unity\b/, appId: 289650 },
  { match: /\b(ac|assassins? creed)\s*(4|iv|black flag)\b/, appId: 242050 },

  // Ubisoft / Open World / Shooters
  { match: /\bfar cry\s*6\b/, appId: 2369390 },
  { match: /\bfar cry\s*5\b/, appId: 552520 },
  { match: /\bfar cry\s*4\b/, appId: 298110 },
  { match: /\bfar cry\s*3\b/, appId: 220240 },
  { match: /\bwatch dogs\s*legion\b/, appId: 2239550 },
  { match: /\bwatch dogs\s*2\b/, appId: 447040 },
  { match: /\bghost reco[nm]\s*breakpoint\b/, appId: 2231380 },
  { match: /\brainbow six\s*siege\b/, appId: 359550 },
  { match: /\briders republic\b/, appId: 2290180 },
  { match: /\bmetro exodus\b/, appId: 412020 },
  { match: /\bdoom eternal\b/, appId: 782330 },
  { match: /\bdoom\b/, appId: 379720 },
  { match: /\bborderlands\s*3\b/, appId: 397540 },
  { match: /\bbioshock\b/, appId: 8870 },
  { match: /\bmafia\s*2\b/, appId: 1030830 },
  { match: /\bmafia\s*3\b/, appId: 360430 },
  { match: /\bmafia\s*(1|definitive)\b/, appId: 1030840 },
  { match: /\barma reforger\b/, appId: 1874880 },

  // Horror & Survival
  { match: /\bsilent hill\s*2\b/, appId: 2124490 },
  { match: /\bfive nights at freddys.*security breach\b/, appId: 747660 },
  { match: /\boutlast\s*2\b/, appId: 414700 },
  { match: /\boutlast\b/, appId: 238320 },
  { match: /\bpoppy playtime\b/, appId: 1721470 },
  { match: /\bdead island\s*2\b/, appId: 934700 },
  { match: /\bdying light\s*2\b/, appId: 534380 },
  { match: /\bdying light\b/, appId: 239140 },
  { match: /\bdead by daylight\b/, appId: 381210 },
  { match: /\blittle nightmares\s*2\b/, appId: 860510 },
  { match: /\blittle nightmares\b/, appId: 424840 },
  { match: /\bark\s*survival\b/, appId: 346110 },
  { match: /\brust\b/, appId: 252490 },
  { match: /\bno mans?\s*sky\b/, appId: 275850 },

  // RPGs / Yakuza / Persona / Final Fantasy / Monster Hunter / Sports / Sim
  { match: /\blike a dragon.*infinite wealth\b/, appId: 2072450 },
  { match: /\byakuza.*like a dragon\b/, appId: 1235140 },
  { match: /\byakuza\s*0\b/, appId: 638970 },
  { match: /\bfinal fantasy\s*(7|vii)\b/, appId: 1462040 },
  { match: /\bbaldurs?\s*gate\s*3\b/, appId: 1086940 },
  { match: /\bdiablo\s*(4|iv)\b/, appId: 2344520 },
  { match: /\bskyrim\b/, appId: 489830 },
  { match: /\bfallout\s*4\b/, appId: 377160 },
  { match: /\bpersona\s*5\b/, appId: 1687950 },
  { match: /\bmonster hunter\s*world\b/, appId: 582010 },
  { match: /\bmonster hunter\s*rise\b/, appId: 1446780 },
  { match: /\bthe hunter.*call of the wild\b/, appId: 518790 },
  { match: /\bfarming simulator\s*22\b/, appId: 1248130 },
  { match: /\bjurassic world evolution\s*2\b/, appId: 1244460 },
  { match: /\bnba\s*2k2[56]\b/, appId: 2878980 },
  { match: /\bwwe\s*2k25\b/, appId: 2878960 },
];

export function normalizeTitleForCover(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function isValidHttpUrl(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Resolves the best cover URL synchronously:
 * 1. Valid URL from Google Sheet column F (IMAGEN)
 * 2. Verified Steam CDN cover from curated keyword map
 * 3. '' (empty string -> clean PlayStation cover fallback in UI)
 */
export function resolveCoverUrl(
  gameName: string,
  sheetImageUrl?: string
): string {
  if (isValidHttpUrl(sheetImageUrl)) {
    return sheetImageUrl!.trim();
  }

  const normalized = normalizeTitleForCover(gameName);
  if (!normalized) return '';

  for (const rule of CURATED_COVER_RULES) {
    if (rule.match.test(normalized)) {
      return STEAM_CDN(rule.appId);
    }
  }

  return '';
}

const rawgCache = new Map<string, string>();

/**
 * Optional RAWG API cover lookup when RAWG_API_KEY is configured in environment.
 * Memoized in-memory and strictly fails safe to '' so it never breaks rendering.
 */
export async function fetchRawgCover(gameName: string): Promise<string> {
  const apiKey = process.env.RAWG_API_KEY?.trim();
  if (!apiKey) return '';

  const key = normalizeTitleForCover(gameName);
  if (!key) return '';

  if (rawgCache.has(key)) {
    return rawgCache.get(key) || '';
  }

  const cleanSearch = key
    .replace(/\b(preventa|edicion|edition|definitive|remastered|goty|ultimate|standard|deluxe|gold|ps4|ps5)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanSearch) {
    rawgCache.set(key, '');
    return '';
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const url = `https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(cleanSearch)}&page_size=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timer);

    if (!res.ok) {
      rawgCache.set(key, '');
      return '';
    }

    const data = (await res.json()) as {
      results?: Array<{ background_image?: string | null }>;
    };
    const img = data.results?.[0]?.background_image || '';
    const valid = isValidHttpUrl(img) ? img : '';
    rawgCache.set(key, valid);
    return valid;
  } catch {
    rawgCache.set(key, '');
    return '';
  }
}
