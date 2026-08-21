"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfirm } from "@/components/confirm-provider";

export function OrderDeleteButton({
  id,
  orderNumber,
  redirectTo,
  label = "Delete",
  variant = "text",
}: {
  id: number;
  orderNumber: string;
  redirectTo?: string;
  label?: string;
  variant?: "text" | "button";
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const ok = await confirm({
      title: "Delete order",
      message: `Delete order ${orderNumber}? This removes the order and its line items from order history permanently.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    setBusy(true);
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    window.dispatchEvent(new Event("ridexd:orders-updated"));
    setBusy(false);
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="rounded border border-[#d72c0d] bg-white px-3.5 py-2 text-[13px] font-medium text-[#d72c0d] transition hover:bg-[#d72c0d] hover:text-white disabled:opacity-60"
      >
        {busy ? "Deleting…" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="text-[#d72c0d] disabled:opacity-50"
    >
      {busy ? "…" : label}
    </button>
  );
}

export function OrderLinkActions({ id, orderNumber }: { id: number; orderNumber: string }) {
  return (
    <div className="flex items-center justify-end gap-2 text-[12px]">
      <Link
        href={`/admin/orders/${id}`}
        className="rounded border border-[#c9cccf] bg-white px-2.5 py-1 text-[#00a0ac] hover:bg-[#e6f7f8]"
      >
        View
      </Link>
      <OrderDeleteButton id={id} orderNumber={orderNumber} label="Delete" />
    </div>
  );
}
