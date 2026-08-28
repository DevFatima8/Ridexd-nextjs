"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GROUPS } from "@/lib/catalog";
import type { CategoryWithCount } from "@/lib/queries";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title", label: "Alphabetical" },
];

export function ShopFilters({
  group,
  category,
  subcategory,
  sort,
  q,
  counts,
  categories,
}: {
  group: string;
  category: string;
  subcategory?: string;
  sort: string;
  q: string;
  counts: Record<string, number>;
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function push(next: Record<string, string | undefined>) {
    const search = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") search.delete(key);
      else search.set(key, value);
    });
    search.delete("page");
    router.push(`/shop?${search.toString()}`);
  }

  const activeGroup = GROUPS.find((g) => g.slug === group);
  const filteredCategories = group ? categories.filter((c) => c.groupSlug === group) : categories;
  const parentCategories = filteredCategories.filter((c) => !c.parentSlug);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] tracking-[0.24em] uppercase">Search</p>
        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("q");
            push({ q: typeof value === "string" ? value : "" });
          }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search fabric, colour, SKU"
            className="w-full rounded border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </form>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.24em] uppercase">Department</p>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => push({ group: undefined, category: undefined, subcategory: undefined })}
            className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm ${
              !group ? "bg-ink text-white" : "hover:bg-cream"
            }`}
          >
            All departments
          </button>
          {GROUPS.map((g) => (
            <button
              key={g.slug}
              type="button"
              onClick={() => push({ group: g.slug, category: undefined, subcategory: undefined })}
              className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm ${
                group === g.slug ? "bg-ink text-white" : "hover:bg-cream"
              }`}
            >
              <span>{g.name}</span>
              <span className="text-xs opacity-70">{counts[g.slug] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.24em] uppercase">
          Categories{activeGroup ? ` · ${activeGroup.name}` : ""}
        </p>
        <div className="mt-3 space-y-2">
          {parentCategories.map((parentCat) => {
            const isParentActive = group === parentCat.groupSlug && category === parentCat.categorySlug;
            const subItems = filteredCategories.filter((c) => c.parentSlug === parentCat.categorySlug);

            return (
              <div key={parentCat.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    push({
                      group: parentCat.groupSlug,
                      category: isParentActive && !subcategory ? undefined : parentCat.categorySlug,
                      subcategory: undefined,
                    })
                  }
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-medium transition ${
                    isParentActive && !subcategory
                      ? "bg-gold text-white font-semibold"
                      : isParentActive
                        ? "bg-cream text-ink font-semibold"
                        : "hover:bg-cream"
                  }`}
                >
                  <span>{parentCat.name}</span>
                  <span className="text-xs opacity-70">{parentCat.productCount}</span>
                </button>

                {subItems.length > 0 && (
                  <div className="ml-3 space-y-0.5 border-l-2 border-sand/80 pl-2">
                    {subItems.map((sub) => {
                      const isSubActive =
                        group === sub.groupSlug &&
                        category === parentCat.categorySlug &&
                        subcategory === sub.categorySlug;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() =>
                            push({
                              group: sub.groupSlug,
                              category: parentCat.categorySlug,
                              subcategory: isSubActive ? undefined : sub.categorySlug,
                            })
                          }
                          className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-[13px] transition ${
                            isSubActive
                              ? "bg-ink text-white font-medium"
                              : "text-ink-soft hover:bg-cream hover:text-ink"
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-[11px] opacity-75">{sub.productCount}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.24em] uppercase">Sort by</p>
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          className="mt-3 w-full rounded border border-sand bg-cream px-3 py-2 text-sm outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => router.push("/shop")}
        className="w-full rounded-full border border-ink py-2.5 text-[11px] tracking-[0.2em] uppercase"
      >
        Reset filters
      </button>
    </div>
  );
}
