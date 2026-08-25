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
        className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--forest)] text-xl font-bold text-white shadow-md transition hover:bg-[var(--forest-deep)]"
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
