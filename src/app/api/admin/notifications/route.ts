import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listOrderNotifications } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const notifications = await listOrderNotifications();
    return NextResponse.json({ ok: true, count: notifications.length, notifications });
  } catch (error: any) {
    console.error("[admin/notifications] Server-side Database Error:", error?.code || error?.message || error);
    return NextResponse.json(
      { ok: false, error: "Database connection failed. Please try again later." },
      { status: 503 },
    );
  }
}
