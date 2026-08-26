"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatSaleUnit } from "./format";
import type { CartItem, Product } from "./types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mustafa-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    return {
      items,
      count,
      subtotal,
      addItem: (product, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((item) => item.productId === product.id);
          if (existing) {
            return prev.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [
            ...prev,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              unit: formatSaleUnit(product.unit),
              packLabel: product.packLabel,
              imageUrl: product.imageUrl,
              quantity,
            },
          ];
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems((prev) =>
          prev
            .map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
