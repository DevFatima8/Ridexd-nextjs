"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductRow } from "@/db/schema";
import { formatPKR } from "@/lib/catalog";
import { getStoreStockInfo } from "@/lib/stock";
import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: ProductRow }) {
  const { addLine } = useCart();
  const router = useRouter();
  const sizes = product.sizes?.length ? product.sizes : ["Standard"];
  const [variant, setVariant] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const stockInfo = getStoreStockInfo(product.stock);
  const maxQty = Math.max(1, Math.min(20, product.stock));

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
      {/* Stock Status Badge */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            stockInfo.status === "Out of Stock"
              ? "bg-red-100 text-red-800 border border-red-200"
              : stockInfo.status === "Limited Stock"
              ? "bg-amber-100 text-amber-900 border border-amber-200"
              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              stockInfo.status === "Out of Stock"
                ? "bg-red-600"
                : stockInfo.status === "Limited Stock"
                ? "bg-amber-600"
                : "bg-emerald-600"
            }`}
          />
          {stockInfo.badgeText}
        </span>
      </div>

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
          <button
            type="button"
            className="px-4 py-2.5 disabled:opacity-30"
            disabled={!stockInfo.isAvailable || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-10 text-center">{stockInfo.isAvailable ? quantity : 0}</span>
          <button
            type="button"
            className="px-4 py-2.5 disabled:opacity-30"
            disabled={!stockInfo.isAvailable || quantity >= maxQty}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
          >
            +
          </button>
        </div>
        <p className="text-sm text-ink-soft/70">
          {stockInfo.detailText} ·{" "}
          <span className="font-medium text-ink">
            {formatPKR(product.price * (stockInfo.isAvailable ? quantity : 0))}
          </span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!stockInfo.isAvailable}
          onClick={() => addLine({ ...payload, variant }, quantity)}
          className="rounded-full bg-ink py-4 text-[11px] tracking-[0.24em] text-white uppercase transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-75"
        >
          {stockInfo.isAvailable ? "Add to bag" : "Out of Stock"}
        </button>
        <button
          type="button"
          disabled={!stockInfo.isAvailable}
          onClick={() => {
            addLine({ ...payload, variant }, quantity);
            router.push("/checkout");
          }}
          className="rounded-full border border-ink py-4 text-[11px] tracking-[0.24em] uppercase transition hover:bg-cream disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-75"
        >
          {stockInfo.isAvailable ? "Buy it now" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
