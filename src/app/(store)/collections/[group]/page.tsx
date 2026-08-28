import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { GROUPS, GROUP_MAP } from "@/lib/catalog";
import { getCategoryOverview, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ group: string }>;

export function generateStaticParams() {
  return GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { group } = await params;
  const meta = GROUP_MAP[group];
  return {
    title: meta ? `${meta.name} — ${meta.tagline}` : "Collection",
    description: meta?.description,
  };
}

export default async function GroupPage({ params }: { params: Params }) {
  const { group } = await params;
  const meta = GROUP_MAP[group];
  if (!meta) notFound();

  const [latest, premium, categories] = await Promise.all([
    listProducts({ group, pageSize: 8, sort: "newest", status: "active" }),
    listProducts({ group, pageSize: 4, sort: "price-desc", status: "active" }),
    getCategoryOverview(group),
  ]);

  return (
    <div>
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.image} alt={meta.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/15" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 text-cream md:py-32">
          <p className="text-[11px] tracking-luxe text-gold-soft uppercase">{meta.tagline}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{meta.name}</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/80">{meta.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-[11px] tracking-luxe text-gold uppercase">
          {categories.filter((c) => !c.parentSlug).length} categories
        </p>
        <h2 className="mt-3 font-display text-3xl">Shop {meta.name} by category</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories
            .filter((cat) => !cat.parentSlug)
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?group=${group}&category=${cat.categorySlug}`}
                className="group overflow-hidden rounded-xl border border-sand"
              >
                <div className="aspect-[4/5] overflow-hidden bg-cream">
                  {cat.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cream text-xs text-ink-soft/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-medium group-hover:text-plum">{cat.name}</p>
                  <p className="mt-1 text-xs text-ink-soft/70">{cat.tagline}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="border-y border-sand bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl">New in {meta.name}</h2>
            <Link
              href={`/shop?group=${group}`}
              className="text-[11px] tracking-[0.2em] text-gold uppercase"
            >
              View all →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {latest.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-3xl">Premium picks</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {premium.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
