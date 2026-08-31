import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE } from "@/app/api/customer/session/route";
import {
  createOrUpdateReview,
  deleteCustomerReview,
  getCustomerProductReview,
  getProductById,
  getProductReviewSummary,
  hasCustomerPurchasedProduct,
  listProductReviews,
} from "@/lib/queries";

type RouteParams = Promise<{ id: string }>;

async function getCustomerSession() {
  const store = await cookies();
  const raw = store.get(CUSTOMER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { name: string; email: string };
    if (parsed.email && parsed.email.includes("@")) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId || Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

  const customer = await getCustomerSession();
  const customerEmail = customer?.email ?? url.searchParams.get("email") ?? undefined;

  const [summary, reviews, userReview, isVerifiedBuyer] = await Promise.all([
    getProductReviewSummary(productId),
    listProductReviews(productId, page, pageSize, customerEmail),
    customerEmail ? getCustomerProductReview(productId, customerEmail) : Promise.resolve(null),
    customerEmail ? hasCustomerPurchasedProduct(customerEmail, productId) : Promise.resolve(false),
  ]);

  return NextResponse.json({
    summary,
    reviews: reviews.items,
    total: reviews.total,
    page: reviews.page,
    pageSize: reviews.pageSize,
    pageCount: reviews.pageCount,
    userReview,
    isVerifiedBuyer,
    customer,
  });
}

export async function POST(req: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId || Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const session = await getCustomerSession();
    const body = (await req.json()) as {
      customerName?: string;
      customerEmail?: string;
      rating?: number;
      comment?: string;
    };

    const customerName = (body.customerName || session?.name || "").trim();
    const customerEmail = (body.customerEmail || session?.email || "").trim().toLowerCase();
    const rating = Number(body.rating);
    const comment = String(body.comment || "").trim();

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "You must be logged in with a valid email to write a review." },
        { status: 401 },
      );
    }

    if (!customerName) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please select a rating between 1 and 5 stars" }, { status: 400 });
    }

    if (!comment || comment.length < 3) {
      return NextResponse.json({ error: "Review text must be at least 3 characters long" }, { status: 400 });
    }

    if (comment.length > 2000) {
      return NextResponse.json({ error: "Review text cannot exceed 2000 characters" }, { status: 400 });
    }

    // Automatically set/update session cookie if customerName & customerEmail provided
    const store = await cookies();
    store.set(
      CUSTOMER_COOKIE,
      JSON.stringify({ name: customerName, email: customerEmail }),
      { path: "/", maxAge: 60 * 60 * 24 * 90, sameSite: "lax", httpOnly: true },
    );

    const review = await createOrUpdateReview({
      productId,
      customerName,
      customerEmail,
      rating,
      comment,
    });

    const updatedSummary = await getProductReviewSummary(productId);

    return NextResponse.json({
      ok: true,
      review,
      summary: updatedSummary,
      message: "Your review has been submitted successfully!",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId || Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const session = await getCustomerSession();
  const url = new URL(req.url);
  const email = session?.email || url.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = Number(url.searchParams.get("reviewId"));
  if (!reviewId) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  await deleteCustomerReview(reviewId, email);
  const updatedSummary = await getProductReviewSummary(productId);

  return NextResponse.json({ ok: true, summary: updatedSummary, message: "Review deleted" });
}
