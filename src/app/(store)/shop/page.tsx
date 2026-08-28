import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { GROUP_MAP, categoryLabel } from "@/lib/catalog";
import { getCategoryOverview, getGroupCounts, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop all products",
  description:
    "Browse every Ridexd product across women, men, kids, bed and bath departments with category, price and search filters.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(params: Record<string, string | string[] | undefined>, key: string): string {
  const raw = params[key];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const group = pick(params, "group");
  const category = pick(params, "category");
  const subcategory = pick(params, "subcategory");
  const q = pick(params, "q");
  const sort = pick(params, "sort") || "newest";
  const page = Math.max(1, Number(pick(params, "page") || 1));

  const [result, counts, categories] = await Promise.all([
    listProducts({ group, category, subcategory, q, sort, page, pageSize: 12, status: "active" }),
    getGroupCounts(),
    getCategoryOverview(),
  ]);

  const heading = subcategory
    ? categoryLabel(group, category, subcategory)
    : category
      ? categoryLabel(group, category)
      : group
        ? GROUP_MAP[group]?.name ?? "Shop"
        : "All products";

  function pageHref(target: number) {
    const search = new URLSearchParams();
    if (group) search.set("group", group);
    if (category) search.set("category", category);
    if (subcategory) search.set("subcategory", subcategory);
    if (q) search.set("q", q);
    if (sort) search.set("sort", sort);
    search.set("page", String(target));
    return `/shop?${search.toString()}`;
  }

  const groupCats = group ? categories.filter((cat) => cat.groupSlug === group) : categories;
  const topCats = groupCats.filter((cat) => !cat.parentSlug);
  const subCats = category ? groupCats.filter((cat) => cat.parentSlug === category) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-[11px] tracking-[0.16em] text-ink-soft/60 uppercase">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {group && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/collections/${group}`} className="hover:text-ink">
              {GROUP_MAP[group]?.name ?? group}
            </Link>
          </>
        )}
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/shop?group=${group}&category=${category}`} className="hover:text-ink">
              {categoryLabel(group, category)}
            </Link>
          </>
        )}
        {subcategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink font-medium">{categoryLabel(group, category, subcategory)}</span>
          </>
        )}
      </nav>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">{heading}</h1>
          <p className="mt-2 text-sm text-ink-soft/70">
            {result.total} products
            {q ? ` matching “${q}”` : ""}
            {subcategory
              ? ` in ${categoryLabel(group, category, subcategory)}`
              : category
                ? ` in ${categoryLabel(group, category)}`
                : group
                  ? ` in ${GROUP_MAP[group]?.name ?? group}`
                  : " across all departments"}
          </p>
        </div>
        {group && (
          <div className="flex flex-wrap gap-2">
            {subCats.length > 0 ? (
              <>
                <Link
                  href={`/shop?group=${group}&category=${category}`}
                  className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition ${
                    !subcategory ? "border-ink bg-ink text-white" : "border-sand hover:border-ink"
                  }`}
                >
                  All {categoryLabel(group, category)}
                </Link>
                {subCats.map((sc) => (
                  <Link
                    key={sc.id}
                    href={`/shop?group=${group}&category=${category}&subcategory=${sc.categorySlug}`}
                    className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition ${
                      subcategory === sc.categorySlug ? "border-ink bg-ink text-white" : "border-sand hover:border-ink"
                    }`}
                  >
                    {sc.name}
                  </Link>
                ))}
              </>
            ) : (
              topCats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?group=${group}&category=${cat.categorySlug}`}
                  className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition ${
                    category === cat.categorySlug ? "border-ink bg-ink text-white" : "border-sand hover:border-ink"
                  }`}
                >
                  {cat.name}
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-sand p-5 lg:sticky lg:top-32">
          <Suspense fallback={<p className="text-sm text-ink-soft/60">Loading filters…</p>}>
            <ShopFilters
              group={group}
              category={category}
              subcategory={subcategory}
              sort={sort}
              q={q}
              counts={counts}
              categories={categories}
            />
          </Suspense>
        </aside>

        <div>
          {result.items.length === 0 ? (
            <div className="rounded-2xl border border-sand bg-cream p-14 text-center">
              <p className="font-display text-2xl">No products found</p>
              <p className="mt-2 text-sm text-ink-soft/70">
                Try a different category or reset the filters.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                {result.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {result.pageCount > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={pageHref(page - 1)}
                      className="rounded-full border border-sand px-4 py-2 text-sm hover:border-ink"
                    >
                      ← Prev
                    </Link>
                  )}
                  {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      href={pageHref(n)}
                      className={`h-10 w-10 rounded-full text-center text-sm leading-10 ${
                        n === page ? "bg-ink text-white" : "border border-sand hover:border-ink"
                      }`}
                    >
                      {n}
                    </Link>
                  ))}
                  {page < result.pageCount && (
                    <Link
                      href={pageHref(page + 1)}
                      className="rounded-full border border-sand px-4 py-2 text-sm hover:border-ink"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
