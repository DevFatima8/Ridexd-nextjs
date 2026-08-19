import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/admin/category-manager";
import { isAdmin } from "@/lib/auth";
import { getCategoryOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategoryOverview();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Categories</h1>
        <p className="mt-1 text-[13px] text-[#6d7175]">
          Create as many categories as you need — each one appears instantly across the storefront.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
