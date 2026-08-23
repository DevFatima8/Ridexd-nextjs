import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listContactMessages } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") as "all" | "unread" | "read" | null;
    const status = statusParam ?? "all";
    const search = searchParams.get("search") ?? undefined;

    const messages = await listContactMessages({ status, search });
    return NextResponse.json({ ok: true, messages });
  } catch (error) {
    console.error("[api/admin/contact-messages] Error fetching messages:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch contact messages." },
      { status: 500 },
    );
  }
}
