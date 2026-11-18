'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CartItem, Game, GameOption } from '@/types/game';
import { DEFAULT_WHATSAPP_PHONE } from './format';

const CART_STORAGE_KEY = 'gamestore_cart_v1';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  toastMessage: string | null;
  whatsappPhone: string;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (game: Game, option: GameOption) => void;
  incrementQty: (cartKey: string) => void;
  decrementQty: (cartKey: string) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;
  showToast: (message: string) => void;
  setWhatsappPhone: (phone: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [whatsappPhone, setWhatsappPhoneState] = useState<string>(
    DEFAULT_WHATSAPP_PHONE
  );
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted cart from localStorage strictly after mount (zero hydration mismatch)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (i): i is CartItem =>
              Boolean(i) &&
              typeof i.cartKey === 'string' &&
              typeof i.name === 'string' &&
              typeof i.price === 'number' &&
              typeof i.qty === 'number' &&
              i.qty > 0
          );
          setItems(valid);
        }
      }
    } catch {
      // Ignore storage read errors (private browsing / quota)
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist cart changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  }, [items, hydrated]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Clear toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const setWhatsappPhone = useCallback((phone: string) => {
    if (phone && phone.trim()) {
      setWhatsappPhoneState(phone.trim());
    }
  }, []);

  const addToCart = useCallback(
    (game: Game, option: GameOption) => {
      const cartKey = `${game.id}_${option.type}`;
      setItems((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [
          ...prev,
          {
            cartKey,
            gameId: game.id,
            slug: game.slug,
            name: game.name,
            console: game.console,
            type: option.type,
            price: option.price,
            qty: 1,
            imageUrl: game.imageUrl || '',
          },
        ];
      });
      showToast(`${game.name} (${option.type}) sumado al pedido`);
    },
    [showToast]
  );

  const incrementQty = useCallback((cartKey: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }, []);

  const decrementQty = useCallback((cartKey: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      totalItems,
      totalPrice,
      toastMessage,
      whatsappPhone,
      openCart,
      closeCart,
      addToCart,
      incrementQty,
      decrementQty,
      removeFromCart,
      clearCart,
      showToast,
      setWhatsappPhone,
    }),
    [
      items,
      isOpen,
      totalItems,
      totalPrice,
      toastMessage,
      whatsappPhone,
      openCart,
      closeCart,
      addToCart,
      incrementQty,
      decrementQty,
      removeFromCart,
      clearCart,
      showToast,
      setWhatsappPhone,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
