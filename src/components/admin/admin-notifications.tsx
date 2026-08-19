"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Notification = {
  id: number;
  orderNumber: string;
  customerName: string;
  city: string;
  total: number;
  createdAt: string;
};

function timeAgo(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { notifications?: Notification[] };
      setItems(Array.isArray(data.notifications) ? data.notifications : []);
    } catch {
      /* offline — retry on next tick */
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 15000);
    const refresh = () => load();
    window.addEventListener("ridexd:orders-updated", refresh);
    return () => {
      clearInterval(poll);
      window.removeEventListener("ridexd:orders-updated", refresh);
    };
  }, [load]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const count = items.length;

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        aria-label="New order notifications"
        className="relative rounded border border-[#e3e5e7] bg-white px-2.5 py-1.5 text-[15px] leading-none hover:bg-[#f4f5f7]"
      >
        🔔
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d72c0d] px-1 text-[10px] font-semibold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-[#e3e5e7] bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-[#e3e5e7] px-4 py-2.5">
            <p className="text-[13px] font-semibold">New orders</p>
            <span className="text-[11px] text-[#8c9196]">{count} pending</span>
          </div>

          {count === 0 ? (
            <p className="px-4 py-6 text-center text-[12px] text-[#8c9196]">
              No new orders right now. New checkouts appear here instantly.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-[#f1f2f3] overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/orders/${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-[#fafbfb]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-[#00a0ac]">{item.orderNumber}</p>
                      <p className="text-[12px] font-semibold">PKR {item.total.toLocaleString("en-PK")}</p>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#6d7175]">
                      {item.customerName}
                      {item.city ? ` · ${item.city}` : ""}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8c9196]">
                      Placed {timeAgo(item.createdAt)} · awaiting confirmation
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-[#e3e5e7] px-4 py-2.5">
            <Link href="/admin/orders?status=pending" className="text-[12px] text-[#00a0ac]">
              Open order history →
            </Link>
            <p className="mt-1 text-[10px] leading-relaxed text-[#8c9196]">
              Proceed an order (confirm / pack / ship) and its notification clears automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
