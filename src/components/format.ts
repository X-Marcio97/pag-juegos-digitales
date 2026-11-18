import type { CartItem, Game, GameOption, StoreConfig } from '@/types/game';

export const DEFAULT_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '5491100000000';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'GAME STORE',
  tagline: 'Juegos Digitales Originales',
  announcement:
    'Entrega digital en el día · Precios actualizados en vivo · PS4 & PS5',
  whatsappPhone: DEFAULT_WHATSAPP_PHONE,
  hours: 'Lunes a Sábados · 10 a 21 hs',
};

/**
 * Deterministic ARS currency formatting (avoids SSR/client ICU locale mismatches).
 * Example: 24900 -> "$ 24.900"
 */
export function formatMoney(num: number): string {
  const safe = Math.max(0, Math.round(Number(num) || 0));
  const formatted = safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$ ${formatted}`;
}

export function formatOptionLabel(type: string): string {
  const upper = (type || '').toUpperCase().trim();
  if (upper === 'PRIMARIA') return 'Primaria';
  if (upper === 'SECUNDARIA') return 'Secundaria';
  return type || 'Primaria';
}

export function getDefaultOptionIndex(options: GameOption[]): number {
  if (!options || options.length === 0) return 0;
  const priIdx = options.findIndex((o) =>
    o.type.toUpperCase().includes('PRIMARIA')
  );
  return priIdx >= 0 ? priIdx : 0;
}

export function getCoverGradient(gameName: string, consoleName: string): string {
  const n = (gameName || '').toUpperCase();
  if (n.includes('GTA')) return 'from-[#1a0f2e] via-[#3b1138] to-[#dc0b1c]';
  if (n.includes('FC2') || n.includes('FC 2') || n.includes('FIFA')) {
    return 'from-[#062b1c] via-[#0c4a2e] to-[#00b839]';
  }
  if (n.includes('COD') || n.includes('CALL OF DUTY')) {
    return 'from-[#111318] via-[#262a33] to-[#7c1d1d]';
  }
  if (
    n.includes('FORZA') ||
    n.includes('NEED FOR SPEED') ||
    n.includes('GRAN TURISMO')
  ) {
    return 'from-[#0c1a38] via-[#1c396b] to-[#dc0b1c]';
  }
  if (
    n.includes('GOW') ||
    n.includes('GOD OF WAR') ||
    n.includes('SPIDER') ||
    n.includes('MORTAL KOMBAT')
  ) {
    return 'from-[#1f0a0c] via-[#4a1016] to-[#dc0b1c]';
  }
  if (n.includes('MINECRAFT')) {
    return 'from-[#102614] via-[#1c4d24] to-[#3f7a28]';
  }
  if (n.includes('ELDEN') || n.includes('DARK SOULS') || n.includes('SEKIRO')) {
    return 'from-[#1c160c] via-[#3d2d12] to-[#7a5a1b]';
  }
  if (n.includes('CYBERPUNK')) {
    return 'from-[#1c1808] via-[#3a2a0a] to-[#0f3443]';
  }
  if (n.includes('RED DEAD') || n.includes('RDR')) {
    return 'from-[#240a0a] via-[#5c1111] to-[#9e1b1b]';
  }
  return (consoleName || '').toUpperCase().includes('PS5')
    ? 'from-[#0a1329] via-[#122654] to-[#1a1a24]'
    : 'from-[#081b2e] via-[#0d3b66] to-[#151822]';
}

export function cleanPhone(phone?: string): string {
  const digits = (phone || DEFAULT_WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  return digits || '5491100000000';
}

export function buildGeneralWaLink(phone?: string): string {
  const msg =
    '¡Hola! Vi el catálogo web de juegos digitales y quería hacer una consulta.';
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(msg)}`;
}

export function buildSingleWaLink(
  phone: string | undefined,
  game: Pick<Game, 'name' | 'console'>,
  opt: GameOption
): string {
  const msg = `¡Hola! Me interesa comprar este juego del catálogo:\n🎮 *${game.name}*\n🕹️ *Consola:* ${game.console}\n🔑 *Cuenta:* ${opt.type}\n💰 *Precio:* ${formatMoney(opt.price)}\n\n¿Cómo coordinamos el pago? ¡Gracias!`;
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(msg)}`;
}

export function buildCartWaLink(
  phone: string | undefined,
  items: CartItem[],
  totalMoney: number
): string {
  const lines = items
    .map(
      (i) =>
        `• ${i.qty > 1 ? `(${i.qty}x) ` : ''}*${i.name}* [${i.console} - ${i.type}] → ${formatMoney(i.price * i.qty)}`
    )
    .join('\n');
  const fullMsg = `¡Hola! Quiero encargar los siguientes juegos del catálogo:\n\n${lines}\n\n💰 *Total estimado:* ${formatMoney(totalMoney)}\n\n¿Me confirmás stock y datos para abonar? ¡Gracias!`;
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(fullMsg)}`;
}
