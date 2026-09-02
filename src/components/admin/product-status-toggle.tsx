"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductStatusToggle({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status || "active");
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    setCurrentStatus(newStatus);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        setCurrentStatus(status);
      } else {
        router.refresh();
      }
    } catch {
      setCurrentStatus(status);
    } finally {
      setUpdating(false);
    }
  }

  const isCurrentActive = currentStatus === "active";

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={updating}
        className={`rounded px-2.5 py-1 text-[11px] font-semibold outline-none cursor-pointer transition border ${
          isCurrentActive
            ? "border-[#a6e5b8] bg-[#e6f9ed] text-[#107f5a] hover:bg-[#d5f5df]"
            : "border-[#e3e5e7] bg-[#f4f5f7] text-[#6d7175] hover:bg-[#e4e5e7]"
        } disabled:opacity-50`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
