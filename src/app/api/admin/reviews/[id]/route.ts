import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteReviewAdmin, updateReviewStatus } from "@/lib/queries";

type RouteParams = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: RouteParams }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = Number(id);
  if (!reviewId || Number.isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
  }

  try {
    const body = (await req.json()) as { status?: string };
    const status = body.status;
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value. Must be approved, rejected, or pending." },
        { status: 400 },
      );
    }

    const updated = await updateReviewStatus(reviewId, status);
    if (!updated) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, review: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: RouteParams }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = Number(id);
  if (!reviewId || Number.isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
  }

  await deleteReviewAdmin(reviewId);
  return NextResponse.json({ ok: true });
}
