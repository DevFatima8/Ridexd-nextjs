import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createCategory, getCategoryOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categories = await getCategoryOverview(searchParams.get("group") ?? undefined);
  return NextResponse.json({ ok: true, categories });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const created = await createCategory({
      groupSlug: String(body.groupSlug ?? "women"),
      parentSlug: body.parentSlug ? String(body.parentSlug) : "",
      name: String(body.name ?? ""),
      tagline: body.tagline ? String(body.tagline) : "",
      description: body.description ? String(body.description) : "",
      imageUrl: body.imageUrl ? String(body.imageUrl) : "",
    });
    return NextResponse.json({ ok: true, category: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Create failed" },
      { status: 400 },
    );
  }
}
