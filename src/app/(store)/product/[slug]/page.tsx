import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductReviews } from "@/components/product-reviews";
import { GROUP_MAP, categoryLabel, formatPKR } from "@/lib/catalog";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  const related = await getRelatedProducts(product, 4);
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-[11px] tracking-[0.16em] text-ink-soft/60 uppercase">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${product.groupSlug}`} className="hover:text-ink">
          {GROUP_MAP[product.groupSlug]?.name ?? product.groupSlug}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop?group=${product.groupSlug}&category=${product.categorySlug}`}
          className="hover:text-ink"
        >
          {categoryLabel(product.groupSlug, product.categorySlug)}
        </Link>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} title={product.title} />

        <div>
          <p className="text-[11px] tracking-luxe text-gold uppercase">
            {product.vendor} · {categoryLabel(product.groupSlug, product.categorySlug)}
          </p>
          <h1 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{product.title}</h1>
          <p className="mt-2 text-sm text-ink-soft/75">{product.subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold">{formatPKR(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-sm text-ink-soft/50 line-through">
                  {formatPKR(product.compareAtPrice)}
                </span>
                <span className="rounded bg-plum px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-soft/60">
            Inclusive of all taxes · SKU {product.sku}
          </p>

          <AddToCart product={product} />

          <div className="mt-10 divide-y divide-sand border-y border-sand text-sm">
            <details open className="py-4">
              <summary className="cursor-pointer text-[11px] tracking-[0.2em] uppercase">
                Product details
              </summary>
              <div className="mt-3 space-y-2 text-ink-soft/80">
                <p>{product.description}</p>
                <ul className="grid gap-1 sm:grid-cols-2">
                  <li>Fabric: {product.fabric}</li>
                  <li>Colour: {product.colorFamily}</li>
                  <li>Vendor: {product.vendor}</li>
                  <li>Sizes: {(product.sizes ?? []).join(", ")}</li>
                </ul>
              </div>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer text-[11px] tracking-[0.2em] uppercase">
                Delivery &amp; returns
              </summary>
              <p className="mt-3 text-ink-soft/80">
                Dispatched in 24–48 hours from our Lahore warehouse. Cash on delivery available
                nationwide. Flat Rs 250 delivery, free above Rs 5,000. 14 day exchange on unworn items
                with tags.
              </p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer text-[11px] tracking-[0.2em] uppercase">
                Size guide
              </summary>
              <p className="mt-3 text-ink-soft/80">
                Model is 5&apos;7&quot; wearing size small. For relaxed fit, we recommend sizing up one
                size. Need help? WhatsApp our styling desk at 0300-000-0000.
              </p>
            </details>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} productTitle={product.title} />

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl">You may also like</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

