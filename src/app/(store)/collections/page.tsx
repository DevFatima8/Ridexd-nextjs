import Link from "next/link";
import { GROUPS } from "@/lib/catalog";
import { getCategoryOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All collections",
  description:
    "Every Ridexd collection — women, men, kids, bed and bath — each with five dedicated categories.",
};

export default async function CollectionsPage() {
  const overview = await getCategoryOverview();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <p className="text-[11px] tracking-luxe text-gold uppercase">Collections</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Browse every category</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft/75">
        Five departments, each split into five focused categories — from women&apos;s stitched, unstitched
        and luxury pret to men&apos;s elegant tailoring, kidswear and complete bed &amp; bath textiles.
      </p>

      <div className="mt-12 space-y-16">
        {GROUPS.map((group) => (
          <section key={group.slug}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl">{group.name}</h2>
                <p className="mt-1 text-sm text-ink-soft/70">{group.tagline}</p>
              </div>
              <Link
                href={`/collections/${group.slug}`}
                className="text-[11px] tracking-[0.2em] text-gold uppercase"
              >
                Shop department →
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {overview.filter((cat) => cat.groupSlug === group.slug).map((cat) => {
                return (
                  <Link
                    key={cat.id}
                    href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
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
                      <p className="mt-2 text-[10px] tracking-[0.2em] text-gold uppercase">
                        {cat.productCount} items
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
