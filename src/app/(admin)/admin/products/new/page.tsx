import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { isAdmin } from "@/lib/auth";
import { getCategoryOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategoryOverview();

  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/products" className="text-[12px] text-[#00a0ac]">
          ← Products
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Add product</h1>
        <p className="mt-1 text-[13px] text-[#6d7175]">
          Fill in the details, choose a department and one of its five categories, then publish.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
