import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listAdminReviews } from "@/lib/queries";

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const productId = url.searchParams.get("productId")
    ? Number(url.searchParams.get("productId"))
    : undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const search = url.searchParams.get("search") ?? undefined;
  const page = url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1;
  const pageSize = url.searchParams.get("pageSize")
    ? Number(url.searchParams.get("pageSize"))
    : 20;

  const result = await listAdminReviews({
    productId,
    status,
    search,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
