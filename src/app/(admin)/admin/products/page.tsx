import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { isAdmin } from "@/lib/auth";
import { GROUPS, categoryLabel, formatPKR } from "@/lib/catalog";
import { getCategoryOverview, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(params: Record<string, string | string[] | undefined>, key: string): string {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const params = await searchParams;
  const q = pick(params, "q");
  const group = pick(params, "group") || "all";
  const status = pick(params, "status") || "all";
  const page = Math.max(1, Number(pick(params, "page") || 1));

  const categories = await getCategoryOverview(group !== "all" ? group : undefined);

  const result = await listProducts({
    q,
    group,
    status,
    page,
    pageSize: 20,
    sort: pick(params, "sort") || "newest",
  });

  const activeCategory = pick(params, "category");
  const categoryOptions = group !== "all" ? categories : [];

  function href(next: Record<string, string>) {
    const search = new URLSearchParams({ q, group, status, ...next });
    Array.from(search.entries()).forEach(([key, value]) => {
      if (!value || value === "all") search.delete(key);
    });
    return `/admin/products?${search.toString()}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">{result.total} products in your catalogue</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="rounded bg-[#303335] px-3.5 py-2 text-[13px] text-white hover:bg-black"
          >
            + Add product
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="rounded border border-[#c9cccf] bg-white px-3.5 py-2 text-[13px] hover:bg-[#f4f5f7]"
          >
            View store
          </Link>
        </div>
      </div>

      <form className="rounded-lg border border-[#e3e5e7] bg-white p-4" action="/admin/products">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title, SKU, fabric…"
            className="rounded border border-[#c9cccf] px-3 py-2 text-[13px] outline-none focus:border-[#00a0ac]"
          />
          <select
            name="group"
            defaultValue={group}
            className="rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
          >
            <option value="all">All departments</option>
            {GROUPS.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          {categoryOptions.length > 0 ? (
            <select
              name="category"
              defaultValue={activeCategory}
              className="rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              <option value="">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c.categorySlug} value={c.categorySlug}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              name="status"
              defaultValue={status}
              className="rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          )}
          <select
            name="status"
            defaultValue={status}
            className="rounded border border-[#c9cccf] px-3 py-2 text-[13px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="submit"
            className="rounded bg-[#00a0ac] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#00838d]"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-[#e3e5e7] bg-white">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-3 py-3">Department</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Inventory</th>
              <th className="px-3 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((product) => (
              <tr key={product.id} className="border-t border-[#f1f2f3] align-middle hover:bg-[#fafbfb]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0] ?? ""}
                      alt={product.title}
                      className="h-11 w-9 rounded object-cover"
                    />
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="font-medium text-[#00a0ac]">
                        {product.title}
                      </Link>
                      <p className="text-[11px] text-[#8c9196]">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 capitalize">{product.groupSlug}</td>
                <td className="px-3 py-3">
                  {categoryLabel(product.groupSlug, product.categorySlug)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] capitalize ${
                      product.status === "active"
                        ? "bg-[#e3f4e6] text-[#107f5a]"
                        : "bg-[#f1f2f3] text-[#6d7175]"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={product.stock <= 10 ? "text-[#d72c0d]" : ""}>{product.stock}</span>{" "}
                  in stock
                </td>
                <td className="px-3 py-3 text-right font-medium">{formatPKR(product.price)}</td>
                <td className="px-4 py-3">
                  <ProductRowActions id={product.id} title={product.title} />
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8c9196]">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 text-[13px]">
          {page > 1 && (
            <Link href={href({ page: String(page - 1) })} className="rounded border border-[#c9cccf] bg-white px-3 py-1.5">
              ← Prev
            </Link>
          )}
          <span className="text-[#6d7175]">
            Page {page} of {result.pageCount}
          </span>
          {page < result.pageCount && (
            <Link href={href({ page: String(page + 1) })} className="rounded border border-[#c9cccf] bg-white px-3 py-1.5">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
