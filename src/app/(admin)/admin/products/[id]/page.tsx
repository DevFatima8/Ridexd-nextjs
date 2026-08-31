import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminReviewsSection } from "@/components/admin/admin-reviews-section";
import { ProductForm } from "@/components/admin/product-form";
import { isAdmin } from "@/lib/auth";
import { getCategoryOverview, getProductById } from "@/lib/queries";
import { getAdminStockBadge } from "@/lib/stock";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(Number(id)),
    getCategoryOverview(),
  ]);
  if (!product) notFound();

  const stockBadge = getAdminStockBadge(product.stock);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/products" className="text-[12px] text-[#00a0ac]">
            ← Products
          </Link>
          <h1 className="mt-2 text-xl font-semibold">{product.title}</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            SKU {product.sku || "N/A"} · {product.groupSlug} / {product.categorySlug}
          </p>
        </div>
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="rounded border border-[#c9cccf] bg-white px-3.5 py-2 text-[13px] hover:bg-[#f4f5f7]"
        >
          View on store ↗
        </Link>
      </div>

      {/* Inventory Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#e3e5e7] bg-white p-4 text-[13px]">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[#6d7175]">Current Stock: </span>
            <strong className="font-semibold text-[#202223]">{product.stock}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6d7175]">Stock Status: </span>
            <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-[11px] font-semibold ${stockBadge.badgeClass}`}>
              {stockBadge.status}
            </span>
          </div>
          <div>
            <span className="text-[#6d7175]">Total Sold: </span>
            <strong className="font-semibold text-[#202223]">{product.totalSold}</strong>
          </div>
        </div>
        <p className="text-[12px] text-[#8c9196]">
          Update the Stock Quantity below to restock this product.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
      <AdminReviewsSection productId={product.id} />
    </div>
  );
}

