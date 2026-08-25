"use client";

import { useState } from "react";
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

  if (icon) {
    return (
      <button
        type="button"
        aria-label={`Adicionar ${product.name}`}
        className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--forest)] text-lg font-medium text-white shadow-[0_8px_20px_rgba(59,19,87,0.22)] transition hover:scale-105 hover:bg-[var(--forest-deep)]"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          addItem(product);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1000);
        }}
      >
        {added ? "✓" : "+"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn ${compact ? "btn-secondary px-3 text-sm" : "btn-primary"}`}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Adicionado" : compact ? "Adicionar" : "Adicionar ao pedido"}
    </button>
  );
}
