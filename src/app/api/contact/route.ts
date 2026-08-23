import { NextResponse, type NextRequest } from "next/server";
import { createContactMessage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone || phoneDigits.length < 7) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid phone number (at least 7 digits)." },
        { status: 400 },
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please enter a message (minimum 10 characters)." },
        { status: 400 },
      );
    }

    await createContactMessage({ name, email, phone, message });

    return NextResponse.json(
      { ok: true, message: "Thank you! Your message has been received." },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[api/contact] Detailed Error:", error?.stack || error?.message || error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to submit message. Please try again later." },
      { status: 500 },
    );
  }
}
