"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AdminNotifications } from "./admin-notifications";
import { GROUPS } from "@/lib/catalog";
import { useConfirm } from "@/components/confirm-provider";

const NAV = [
  { href: "/admin", label: "Home", icon: "▤" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/products", label: "Products", icon: "🏷" },
  { href: "/admin/categories", label: "Categories", icon: "🗂" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/messages", label: "Messages", icon: "💬" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const fetchUnreadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contact-messages/unread-count", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.unreadCount === "number") {
        setUnreadMessages(data.unreadCount);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 15000);
    const handler = () => fetchUnreadMessages();
    window.addEventListener("ridexd:messages-updated", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("ridexd:messages-updated", handler);
    };
  }, [pathname, fetchUnreadMessages]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#f4f5f7]">{children}</div>;
  }

  async function logout() {
    const ok = await confirm({
      title: "Log out",
      message: "Are you sure you want to log out of the admin panel?",
      confirmText: "Log out",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#202223]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed top-0 left-0 z-40 flex h-screen w-60 shrink-0 flex-col justify-between overflow-y-auto hide-scrollbar bg-[#1a1c1d] px-3 py-5 text-[#e3e5e7] transition-transform lg:sticky lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 px-2">
              <img
                src="/logo.png"
                alt="Ridexd Admin"
                className="h-8 w-auto max-w-[32px] object-contain rounded bg-white/10 p-0.5"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Ridexd Admin</p>
                <p className="text-[10px] text-[#9aa0a6]">ridexd.com</p>
              </div>
            </div>

            <nav className="mt-6 space-y-0.5">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const isMessages = item.href === "/admin/messages";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded px-2.5 py-2 text-[13px] transition ${
                      active ? "bg-[#303335] text-white" : "hover:bg-[#26292b]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-center opacity-80">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isMessages && unreadMessages > 0 && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#d72c0d] px-1 text-[10px] font-bold text-white">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="px-2 text-[10px] tracking-[0.2em] text-[#9aa0a6] uppercase">Departments</p>
              <div className="mt-2 space-y-0.5">
                {GROUPS.map((group) => (
                  <Link
                    key={group.slug}
                    href={`/admin/products?group=${group.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded px-2.5 py-1.5 text-[13px] hover:bg-[#26292b]"
                  >
                    {group.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-1 border-t border-white/10 pt-3">
            <Link
              href="/"
              className="block rounded px-2.5 py-2 text-[13px] hover:bg-[#26292b]"
              target="_blank"
            >
              ↗ View online store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded px-2.5 py-2 text-left text-[13px] text-red-400 hover:bg-[#26292b] hover:text-red-300 transition"
            >
              ⎋ Log out
            </button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#e3e5e7] bg-white px-4 py-3 lg:px-6">
            <button
              type="button"
              className="rounded border border-[#e3e5e7] px-3 py-1.5 text-sm lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
            <p className="text-sm text-[#6d7175]">
              {pathname === "/admin" ? "Dashboard" : pathname.replace("/admin/", "").replace(/\//g, " › ")}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/orders?status=pending"
                className="hidden rounded border border-[#e3e5e7] bg-white px-3 py-1.5 text-[13px] hover:bg-[#f4f5f7] sm:block"
              >
                Orders
              </Link>
              <Link
                href="/admin/products/new"
                className="rounded bg-[#303335] px-3 py-1.5 text-[13px] text-white hover:bg-black"
              >
                + Add product
              </Link>
              <AdminNotifications />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a0ac] text-xs font-semibold text-white">
                RX
              </span>
            </div>
          </header>
          <main className="px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
