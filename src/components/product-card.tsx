"use client";

import Link from "next/link";
import type { ProductRow } from "@/db/schema";
import { categoryLabel, formatPKR } from "@/lib/catalog";
import { getStoreStockInfo } from "@/lib/stock";
import { useCart } from "./cart-provider";

import { StarRating } from "./star-rating";

export function ProductCard({
  product,
  rating,
}: {
  product: ProductRow & { avgRating?: number; reviewCount?: number };
  rating?: { avg: number; total: number };
}) {
  const { addLine } = useCart();
  const images = product.images ?? [];
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const avgScore = rating?.avg ?? product.avgRating;
  const totalCount = rating?.total ?? product.reviewCount;
  const stockInfo = getStoreStockInfo(product.stock);

  return (
    <div className="group relative flex flex-col h-full rounded-xl bg-white p-2 transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-lg bg-cream">
        <div className="aspect-[3/4] w-full overflow-hidden relative">
          {images[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={images[0]}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
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
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </div>

        {/* Badges Container */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discount > 0 && (
            <span className="rounded bg-plum px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-sm">
              −{discount}%
            </span>
          )}
          {product.featured && (
            <span className="rounded bg-gold px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-sm">
              Featured
            </span>
          )}
          {stockInfo.status === "Out of Stock" ? (
            <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-sm">
              Out of Stock
            </span>
          ) : stockInfo.status === "Limited Stock" ? (
            <span className="rounded bg-amber-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-sm">
              Limited Stock
            </span>
          ) : null}
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
        disabled={!stockInfo.isAvailable}
        className="mt-2.5 w-full rounded-full border border-ink py-2 sm:py-2 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-ink hover:text-white active:scale-98 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-75"
      >
        {stockInfo.isAvailable ? "Quick add" : "Out of Stock"}
      </button>

      <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5">
        <div>
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <p className="text-[10px] tracking-[0.18em] font-medium text-gold uppercase">
              {categoryLabel(product.groupSlug, product.categorySlug)}
            </p>
            {typeof avgScore === "number" && avgScore > 0 && typeof totalCount === "number" && totalCount > 0 ? (
              <StarRating rating={avgScore} size="sm" showScore count={totalCount} />
            ) : null}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="mt-1 block text-xs sm:text-[14px] font-medium leading-snug text-ink transition-colors hover:text-plum line-clamp-2"
          >
            {product.title}
          </Link>
          {product.fabric && (
            <p className="mt-0.5 text-[11px] text-ink-soft/65 line-clamp-1">{product.fabric}</p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs sm:text-[15px] font-semibold text-ink">{formatPKR(product.price)}</span>
          {discount > 0 && (
            <span className="text-[11px] sm:text-xs text-ink-soft/50 line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


