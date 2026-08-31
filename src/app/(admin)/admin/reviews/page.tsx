"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ProductReviewRow } from "@/db/schema";
import { StarRating } from "@/components/star-rating";

type AdminReviewItem = ProductReviewRow & { productTitle?: string };

export default function AdminReviewsPage() {
  const [items, setItems] = useState<AdminReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        ...(status !== "all" ? { status } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const res = await fetch(`/api/admin/reviews?${query.toString()}`);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) return;

      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setPageCount(data.pageCount ?? 1);
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleStatus(id: number, newStatus: "approved" | "rejected" | "pending") {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating review");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      await fetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting review");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Customer Reviews</h1>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            Moderate and manage product reviews across your storefront ({total} reviews found)
          </p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#e3e5e7] bg-white p-4">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: "All Reviews" },
            { id: "approved", label: "Approved" },
            { id: "pending", label: "Pending Approval" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatus(tab.id);
                setPage(1);
              }}
              className={`rounded px-3 py-1.5 text-[13px] font-medium transition ${
                status === tab.id
                  ? "bg-[#303335] text-white"
                  : "text-[#6d7175] hover:bg-[#f4f5f7] hover:text-[#202223]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search customer, email or text…"
          className="w-full max-w-xs rounded border border-[#c9cccf] bg-[#fafbfb] px-3.5 py-1.5 text-[13px] outline-none focus:border-[#00a0ac] focus:bg-white"
        />
      </div>

      {/* REVIEWS TABLE */}
      <div className="overflow-x-auto rounded-lg border border-[#e3e5e7] bg-white">
        <table className="w-full min-w-[800px] text-left text-[13px]">
          <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8c9196]">
                  Loading reviews…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8c9196]">
                  No product reviews found matching criteria.
                </td>
              </tr>
            ) : (
              items.map((rev) => (
                <tr key={rev.id} className="border-t border-[#f1f2f3] hover:bg-[#fafbfb]">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/products/${rev.productId}`}
                      className="text-[#00a0ac] hover:underline"
                    >
                      {rev.productTitle || `Product #${rev.productId}`}
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium">{rev.customerName}</p>
                    <p className="text-[11px] text-[#6d7175]">{rev.customerEmail}</p>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <StarRating rating={rev.rating} size="sm" showScore />
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-[13px] text-[#202223] line-clamp-3 whitespace-pre-line">
                      {rev.comment}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-[#6d7175] whitespace-nowrap">
                    {new Date(rev.createdAt).toLocaleDateString("en-PK")}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                        rev.status === "approved"
                          ? "bg-[#e4f5e1] text-[#006e52]"
                          : rev.status === "pending"
                          ? "bg-[#fff5ea] text-[#b45309]"
                          : "bg-[#ffd6d6] text-[#c00]"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {rev.status !== "approved" && (
                        <button
                          type="button"
                          disabled={actionId === rev.id}
                          onClick={() => handleStatus(rev.id, "approved")}
                          className="rounded border border-[#c9cccf] bg-white px-2 py-1 text-[11px] font-medium text-[#006e52] hover:bg-[#f4f5f7] disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={actionId === rev.id}
                          onClick={() => handleStatus(rev.id, "rejected")}
                          className="rounded border border-[#c9cccf] bg-white px-2 py-1 text-[11px] font-medium text-[#b45309] hover:bg-[#f4f5f7] disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionId === rev.id}
                        onClick={() => handleDelete(rev.id)}
                        className="rounded border border-[#ffd6d6] bg-white px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-[#e3e5e7] pt-4 text-[13px]">
          <span className="text-[#6d7175]">
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-[#c9cccf] bg-white px-3 py-1.5 hover:bg-[#f4f5f7] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="rounded border border-[#c9cccf] bg-white px-3 py-1.5 hover:bg-[#f4f5f7] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
