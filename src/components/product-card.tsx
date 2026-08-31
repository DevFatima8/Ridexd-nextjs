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
          {stockInfo.status === "Out of Stock" ? (
            <span className="rounded bg-red-600 px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
              Out of Stock
            </span>
          ) : stockInfo.status === "Limited Stock" ? (
            <span className="rounded bg-amber-600 px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
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
        className="mt-3 w-full rounded-full border border-ink py-2 text-[10px] tracking-[0.2em] uppercase transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-75"
      >
        {stockInfo.isAvailable ? "Quick add" : "Out of Stock"}
      </button>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
            {categoryLabel(product.groupSlug, product.categorySlug)}
          </p>
          {typeof avgScore === "number" && avgScore > 0 && typeof totalCount === "number" && totalCount > 0 ? (
            <StarRating rating={avgScore} size="sm" showScore count={totalCount} />
          ) : null}
        </div>
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

