"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfirm } from "@/components/confirm-provider";

export function ProductRowActions({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const ok = await confirm({
      title: "Delete product",
      message: `Are you sure you want to delete “${title}”? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    setBusy(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-3 text-[12px]">
      <Link
        href={`/admin/products/${id}`}
        className="rounded border border-[#c9cccf] bg-white px-2.5 py-1 text-[#00a0ac] hover:bg-[#e6f7f8]"
      >
        Edit
      </Link>
      <button type="button" onClick={remove} disabled={busy} className="text-[#d72c0d] disabled:opacity-50">
        {busy ? "…" : "Delete"}
      </button>
    </div>
  );
}
