import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { MAX_PRODUCT_IMAGES } from "@/lib/catalog";
import { deleteProduct, getProductById, updateProduct } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, product });
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const patch: Record<string, unknown> = {};
    const strings = [
      "title",
      "subtitle",
      "description",
      "groupSlug",
      "categorySlug",
      "subcategorySlug",
      "sku",
      "barcode",
      "fabric",
      "colorFamily",
      "status",
      "vendor",
    ] as const;
    strings.forEach((key) => {
      if (body[key] !== undefined) patch[key] = String(body[key]);
    });
    const numbers = ["price", "compareAtPrice", "cost", "stock"] as const;
    numbers.forEach((key) => {
      if (body[key] !== undefined) patch[key] = Number(body[key]);
    });
    if (body.featured !== undefined) patch.featured = Boolean(body.featured);
    if (Array.isArray(body.sizes)) patch.sizes = body.sizes.map(String);
    if (Array.isArray(body.images)) {
      const images = body.images.map(String).filter(Boolean);
      if (images.length > MAX_PRODUCT_IMAGES) {
        return NextResponse.json(
          { ok: false, error: `A product can have at most ${MAX_PRODUCT_IMAGES} images.` },
          { status: 400 },
        );
      }
      patch.images = images;
    }

    const updated = await updateProduct(Number(id), patch);
    if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await deleteProduct(Number(id));
  return NextResponse.json({ ok: true });
}
