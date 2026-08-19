import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listOrderNotifications } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const notifications = await listOrderNotifications();
  return NextResponse.json({ ok: true, count: notifications.length, notifications });
}
