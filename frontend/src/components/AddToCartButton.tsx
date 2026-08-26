"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  compact = false,
  icon = false,
}: {
  product: Product;
  compact?: boolean;
  icon?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function add() {
    addItem(product);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1200);
  }

  if (icon) {
    return (
      <button
        type="button"
        aria-label={`Adicionar ${product.name} ao pedido`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          add();
        }}
        className={`absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg leading-none font-medium text-white shadow-[0_8px_20px_rgba(59,19,87,0.24)] transition duration-300 hover:scale-105 ${
          added ? "bg-[#0f6b45]" : "bg-[var(--forest)] hover:bg-[var(--forest-deep)]"
        }`}
      >
        <span aria-hidden>{added ? "✓" : "+"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={add}
      className={`btn ${compact ? "btn-secondary px-4" : "btn-primary"}`}
    >
      {added ? "Adicionado ✓" : compact ? "Adicionar" : "Adicionar ao pedido"}
    </button>
  );
}
