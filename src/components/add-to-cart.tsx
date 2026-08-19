"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductRow } from "@/db/schema";
import { formatPKR } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: ProductRow }) {
  const { addLine } = useCart();
  const router = useRouter();
  const sizes = product.sizes?.length ? product.sizes : ["Standard"];
  const [variant, setVariant] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;

  const payload = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.images?.[0] ?? "",
    stock: product.stock,
    variant: sizes[0],
  };

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase">
          {product.groupSlug === "bed" || product.groupSlug === "bath" ? "Size" : "Select size"} —{" "}
          <span className="text-gold">{variant}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setVariant(size)}
              className={`min-w-[62px] rounded border px-4 py-2 text-sm transition ${
                variant === size
                  ? "border-ink bg-ink text-white"
                  : "border-sand hover:border-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-sand">
          <button type="button" className="px-4 py-2.5" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            type="button"
            className="px-4 py-2.5"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
          >
            +
          </button>
        </div>
        <p className="text-sm text-ink-soft/70">
          {soldOut ? "Out of stock" : `${product.stock} in stock`} ·{" "}
          <span className="font-medium text-ink">{formatPKR(product.price * quantity)}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addLine(payload, quantity)}
          className="rounded-full bg-ink py-4 text-[11px] tracking-[0.24em] text-white uppercase transition hover:bg-ink-soft disabled:opacity-40"
        >
          Add to bag
        </button>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            addLine({ ...payload, variant }, quantity);
            router.push("/checkout");
          }}
          className="rounded-full border border-ink py-4 text-[11px] tracking-[0.24em] uppercase transition hover:bg-cream disabled:opacity-40"
        >
          Buy it now
        </button>
      </div>
    </div>
  );
}
