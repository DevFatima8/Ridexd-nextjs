"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductStatusToggle({
  id,
  initialStatus,
}: {
  id: number;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);

  const isActive = status === "active";

  async function toggleStatus() {
    if (updating) return;
    const nextStatus = isActive ? "inactive" : "active";
    setUpdating(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus(nextStatus);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={updating}
      title={isActive ? "Click to set Inactive (hide from web)" : "Click to set Active (show on web)"}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
        isActive
          ? "bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6] border border-[#a8dab5]"
          : "bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed] border border-[#dadce0]"
      } ${updating ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          updating
            ? "animate-ping bg-amber-500"
            : isActive
            ? "bg-[#137333]"
            : "bg-[#5f6368]"
        }`}
      />
      {updating ? "Updating…" : isActive ? "Active" : "Inactive"}
    </button>
  );
}
