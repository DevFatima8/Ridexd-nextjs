"use client";

import { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/confirm-provider";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const confirm = useConfirm();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/contact-messages?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("[admin/messages] Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const notifyChange = () => {
    window.dispatchEvent(new Event("ridexd:messages-updated"));
  };

  async function handleToggleRead(msg: ContactMessage, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    const newStatus = !msg.isRead;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((item) => (item.id === msg.id ? { ...item, isRead: newStatus } : item)),
    );
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/admin/contact-messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newStatus }),
      });
      if (!res.ok) {
        // Rollback
        fetchMessages();
      } else {
        notifyChange();
      }
    } catch (err) {
      console.error("[admin/messages] Error toggling status:", err);
      fetchMessages();
    }
  }

  async function handleDelete(msg: ContactMessage, e?: React.MouseEvent) {
    if (e) e.stopPropagation();

    const ok = await confirm({
      title: "Delete Contact Message",
      message: `Are you sure you want to delete the message from ${msg.name}? This action cannot be undone.`,
      confirmText: "Delete Message",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!ok) return;

    // Optimistic UI update
    setMessages((prev) => prev.filter((item) => item.id !== msg.id));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(null);
    }

    try {
      const res = await fetch(`/api/admin/contact-messages/${msg.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        fetchMessages();
      } else {
        notifyChange();
      }
    } catch (err) {
      console.error("[admin/messages] Error deleting message:", err);
      fetchMessages();
    }
  }

  async function openMessageDetail(msg: ContactMessage) {
    setSelectedMessage(msg);
    // Auto-mark as read if currently unread
    if (!msg.isRead) {
      handleToggleRead(msg);
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Contact Messages</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            View, search, and manage customer inquiries and messages.
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "unread", "read"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium capitalize transition ${
                statusFilter === tab
                  ? "border-[#303335] bg-[#303335] text-white"
                  : "border-[#c9cccf] bg-white text-[#202223] hover:bg-[#f4f5f7]"
              }`}
            >
              {tab === "all" ? "All Messages" : tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#d72c0d] px-1.5 py-0.5 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or message..."
            className="w-full rounded-lg border border-[#c9cccf] bg-white px-3.5 py-2 pl-9 text-[13px] outline-none transition focus:border-[#00a0ac] focus:ring-1 focus:ring-[#00a0ac]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#8c9196]">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-[#8c9196] hover:text-[#202223]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-lg border border-[#e3e5e7] bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[13px] text-[#6d7175] flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin text-[#00a0ac]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Loading contact messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-[#8c9196]">
            <p className="text-2xl mb-2">✉️</p>
            <p className="text-[13px] font-medium text-[#202223]">No messages found</p>
            <p className="text-[12px] mt-1">
              {searchQuery ? "Try clearing your search filters." : "Submitted messages will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead className="bg-[#fafbfb] border-b border-[#e3e5e7] text-[11px] font-semibold uppercase text-[#6d7175]">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sender Name</th>
                  <th className="px-4 py-3">Contact Info</th>
                  <th className="px-4 py-3">Message Preview</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f2f3]">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => openMessageDetail(msg)}
                    className={`cursor-pointer transition hover:bg-[#f4f5f7] ${
                      !msg.isRead ? "bg-amber-50/40 font-medium" : ""
                    }`}
                  >
                    {/* Status badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {msg.isRead ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-[#6d7175]">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                          Unread
                        </span>
                      )}
                    </td>

                    {/* Sender Name */}
                    <td className="px-4 py-3 font-semibold text-[#1a1a1a]">
                      {msg.name}
                    </td>

                    {/* Contact Info */}
                    <td className="px-4 py-3">
                      <div className="text-[#202223] font-normal">{msg.email}</div>
                      <div className="text-[11px] text-[#6d7175]">{msg.phone}</div>
                    </td>

                    {/* Message Preview */}
                    <td className="px-4 py-3 max-w-xs truncate text-[#6d7175]">
                      {msg.message}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-[12px] text-[#6d7175]">
                      {new Date(msg.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openMessageDetail(msg)}
                          className="rounded px-2 py-1 text-[12px] font-medium text-[#00a0ac] hover:bg-[#e0f5f7] transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleRead(msg, e)}
                          title={msg.isRead ? "Mark as unread" : "Mark as read"}
                          className="rounded px-2 py-1 text-[12px] font-medium text-[#6d7175] hover:bg-[#f4f5f7] transition"
                        >
                          {msg.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(msg, e)}
                          title="Delete message"
                          className="rounded px-2 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedMessage(null)}
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#e3e5e7]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#e3e5e7] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1a1a1a]">{selectedMessage.name}</h2>
                  {selectedMessage.isRead ? (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-[#6d7175]">
                      Read
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                      Unread
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#6d7175]">
                  Received on{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString("en-PK", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-full p-1 text-[#6d7175] hover:bg-[#f4f5f7] hover:text-[#1a1a1a]"
              >
                ✕
              </button>
            </div>

            {/* Sender Info Card */}
            <div className="mt-4 grid gap-3 rounded-lg bg-[#f8f9fa] p-3.5 text-xs sm:grid-cols-2 border border-[#e3e5e7]">
              <div>
                <span className="font-semibold text-[#6d7175] uppercase tracking-wider text-[10px]">
                  Email Address
                </span>
                <p className="mt-0.5">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-medium text-[#00a0ac] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#6d7175] uppercase tracking-wider text-[10px]">
                  Phone Number
                </span>
                <p className="mt-0.5">
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="font-medium text-[#00a0ac] hover:underline"
                  >
                    {selectedMessage.phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6d7175]">
                Message Content
              </h3>
              <div className="rounded-xl border border-[#e3e5e7] bg-white p-4 text-sm leading-relaxed text-[#202223] max-h-60 overflow-y-auto whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-[#e3e5e7] pt-4">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage)}
                className="rounded-lg border border-[#c9cccf] bg-white px-3.5 py-2 text-xs font-medium text-[#202223] transition hover:bg-[#f4f5f7]"
              >
                {selectedMessage.isRead ? "Mark as Unread" : "Mark as Read"}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage)}
                  className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                >
                  Delete Message
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-lg bg-[#303335] px-4 py-2 text-xs font-medium text-white transition hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
