import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteContactMessage, updateContactMessageReadStatus } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "Invalid message ID" }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body.isRead !== "boolean") {
      return NextResponse.json({ ok: false, error: "isRead boolean is required" }, { status: 400 });
    }

    const updated = await updateContactMessageReadStatus(id, body.isRead);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: updated });
  } catch (error) {
    console.error("[api/admin/contact-messages/[id]] PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update contact message status." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "Invalid message ID" }, { status: 400 });
    }

    const success = await deleteContactMessage(id);
    if (!success) {
      return NextResponse.json({ ok: false, error: "Failed to delete message" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/contact-messages/[id]] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete message." },
      { status: 500 },
    );
  }
}
