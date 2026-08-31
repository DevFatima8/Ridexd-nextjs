import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminReviewsSection } from "@/components/admin/admin-reviews-section";
import { ProductForm } from "@/components/admin/product-form";
import { isAdmin } from "@/lib/auth";
import { getCategoryOverview, getProductById } from "@/lib/queries";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/products" className="text-[12px] text-[#00a0ac]">
            ← Products
          </Link>
          <h1 className="mt-2 text-xl font-semibold">{product.title}</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            SKU {product.sku} · {product.groupSlug} / {product.categorySlug}
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
      <ProductForm product={product} categories={categories} />
      <AdminReviewsSection productId={product.id} />
    </div>
  );
}

