import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const CUSTOMER_COOKIE = "ridexd_customer";

export async function GET() {
  const store = await cookies();
  const raw = store.get(CUSTOMER_COOKIE)?.value;
  if (!raw) {
    return NextResponse.json({ customer: null });
  }

  try {
    const customer = JSON.parse(raw) as { name: string; email: string };
    if (!customer.email || !customer.email.includes("@")) {
      return NextResponse.json({ customer: null });
    }
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ customer: null });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!name) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const payload = JSON.stringify({ name, email });
    const store = await cookies();
    store.set(CUSTOMER_COOKIE, payload, {
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
      httpOnly: true,
    });

    return NextResponse.json({ ok: true, customer: { name, email } });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function DELETE() {
  const store = await cookies();
  store.delete(CUSTOMER_COOKIE);
  return NextResponse.json({ ok: true });
}
