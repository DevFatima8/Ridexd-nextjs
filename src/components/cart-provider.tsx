"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: number;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  compareAtPrice: number;
  image: string;
  variant: string;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: number, variant: string, quantity: number) => void;
  removeLine: (productId: number, variant: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ridexd_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartLine[];
          if (Array.isArray(parsed)) setLines(parsed);
        }
      } catch {
        /* ignore corrupt storage */
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.productId === line.productId && l.variant === line.variant);
      if (existing) {
        return current.map((l) =>
          l.productId === line.productId && l.variant === line.variant
            ? { ...l, quantity: Math.min(20, l.quantity + quantity) }
            : l,
        );
      }
      return [...current, { ...line, quantity }];
    });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((productId: number, variant: string, quantity: number) => {
    setLines((current) =>
      current
        .map((l) =>
          l.productId === productId && l.variant === variant
            ? { ...l, quantity: Math.max(0, Math.min(20, quantity)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeLine = useCallback((productId: number, variant: string) => {
    setLines((current) =>
      current.filter((l) => !(l.productId === productId && l.variant === variant)),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    return {
      lines,
      ready,
      count,
      subtotal,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addLine,
      setQuantity,
      removeLine,
      clear: () => setLines([]),
    };
  }, [lines, ready, drawerOpen, addLine, setQuantity, removeLine]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
