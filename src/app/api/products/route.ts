import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { MAX_PRODUCT_IMAGES } from "@/lib/catalog";
import { createProduct, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await listProducts({
    group: searchParams.get("group") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    subcategory: searchParams.get("subcategory") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 20),
  });
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const images = Array.isArray(body.images) ? body.images.map(String).filter(Boolean) : [];
    if (images.length > MAX_PRODUCT_IMAGES) {
      return NextResponse.json(
        { ok: false, error: `A product can have at most ${MAX_PRODUCT_IMAGES} images.` },
        { status: 400 },
      );
    }

    const groupSlug = String(body.groupSlug ?? "women");
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${groupSlug}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const created = await createProduct({
      slug,
      title,
      subtitle: String(body.subtitle ?? ""),
      description: String(body.description ?? ""),
      groupSlug,
      categorySlug: String(body.categorySlug ?? "stitched"),
      subcategorySlug: String(body.subcategorySlug ?? ""),
      price: Number(body.price ?? 0),
      compareAtPrice: Number(body.compareAtPrice ?? 0),
      cost: Number(body.cost ?? 0),
      sku: String(body.sku ?? `RDX-${Date.now().toString().slice(-6)}`),
      barcode: String(body.barcode ?? ""),
      stock: Number(body.stock ?? 0),
      sizes: Array.isArray(body.sizes) ? body.sizes.map(String) : [],
      images,
      fabric: String(body.fabric ?? ""),
      colorFamily: String(body.colorFamily ?? ""),
      status: String(body.status ?? "active"),
      featured: Boolean(body.featured),
      vendor: String(body.vendor ?? "Ridexd Studio"),
    });

    return NextResponse.json({ ok: true, product: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 },
    );
  }
}
