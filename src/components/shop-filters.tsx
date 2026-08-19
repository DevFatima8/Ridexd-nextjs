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
  sort,
  q,
  counts,
  categories,
}: {
  group: string;
  category: string;
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
            onClick={() => push({ group: undefined, category: undefined })}
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
              onClick={() => push({ group: g.slug, category: undefined })}
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
        <div className="mt-3 space-y-1">
          {(group ? categories.filter((c) => c.groupSlug === group) : categories).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => push({ group: cat.groupSlug, category: cat.categorySlug })}
              className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm ${
                group === cat.groupSlug && category === cat.categorySlug
                  ? "bg-gold text-white"
                  : "hover:bg-cream"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-70">{cat.productCount}</span>
            </button>
          ))}
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
