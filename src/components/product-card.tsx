"use client";

import Link from "next/link";
import type { ProductRow } from "@/db/schema";
import { categoryLabel, formatPKR } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: ProductRow }) {
  const { addLine } = useCart();
  const images = product.images ?? [];
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-lg bg-cream">
        <div className="aspect-[3/4] w-full overflow-hidden">
          {images[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={images[0]}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cream text-xs text-ink-soft/40">
              No image
            </div>
          )}
          {images[1] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={images[1]}
              alt={`${product.title} alternate`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            />
          ) : null}
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="rounded bg-plum px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
              −{discount}%
            </span>
          )}
          {product.featured && (
            <span className="rounded bg-gold px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
              Featured
            </span>
          )}
          {product.stock <= 10 && (
            <span className="rounded bg-ink px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
              Low stock
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() =>
          addLine({
            productId: product.id,
            slug: product.slug,
            title: product.title,
            subtitle: product.subtitle,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: images[0] ?? "",
            variant: product.sizes?.[0] ?? "",
            stock: product.stock,
          })
        }
        disabled={product.stock <= 0}
        className="mt-3 w-full rounded-full border border-ink py-2 text-[10px] tracking-[0.2em] uppercase transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {product.stock > 0 ? "Quick add" : "Sold out"}
      </button>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
          {categoryLabel(product.groupSlug, product.categorySlug)}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1 text-[15px] font-medium hover:text-plum">
          {product.title}
        </Link>
        <p className="mt-0.5 text-xs text-ink-soft/65">{product.fabric}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-semibold">{formatPKR(product.price)}</span>
          {discount > 0 && (
            <span className="text-xs text-ink-soft/50 line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
