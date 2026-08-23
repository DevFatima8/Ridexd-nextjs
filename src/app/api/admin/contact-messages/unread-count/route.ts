import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getUnreadContactMessagesCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const unreadCount = await getUnreadContactMessagesCount();
    return NextResponse.json({ ok: true, unreadCount });
  } catch (error) {
    console.error("[api/admin/contact-messages/unread-count] Error:", error);
    return NextResponse.json({ ok: false, unreadCount: 0 }, { status: 500 });
  }
}
