import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createOrder, listOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const orders = await listOrders(searchParams.get("status") ?? undefined);
  return NextResponse.json({ ok: true, orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName ?? "").trim();
    const email = String(body.email ?? "").trim();
    if (!customerName || !email) {
      return NextResponse.json({ ok: false, error: "Name and email are required" }, { status: 400 });
    }
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return NextResponse.json({ ok: false, error: "Your cart is empty" }, { status: 400 });
    }

    const order = await createOrder({
      customerName,
      email,
      phone: String(body.phone ?? ""),
      address: String(body.address ?? ""),
      city: String(body.city ?? ""),
      postalCode: String(body.postalCode ?? ""),
      notes: String(body.notes ?? ""),
      paymentMethod: String(body.paymentMethod ?? "cod"),
      items: items.map((item: { productId?: number; quantity?: number; variant?: string }) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity ?? 1),
        variant: item.variant ? String(item.variant) : "",
      })),
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Order failed" },
      { status: 500 },
    );
  }
}
