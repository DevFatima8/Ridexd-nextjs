"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductReviewRow } from "@/db/schema";
import type { ProductReviewSummary } from "@/lib/queries";
import { StarRating } from "@/components/star-rating";

export function AdminReviewsSection({ productId }: { productId: number }) {
  const [summary, setSummary] = useState<ProductReviewSummary>({
    average: 0,
    total: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [reviews, setReviews] = useState<(ProductReviewRow & { productTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, revRes] = await Promise.all([
        fetch(`/api/products/${productId}/reviews`),
        fetch(`/api/admin/reviews?productId=${productId}&status=${filterStatus}`),
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        if (sumData.summary) setSummary(sumData.summary);
      }

      if (revRes.ok) {
        const revData = await revRes.json();
        if (revData.items) setReviews(revData.items);
      }
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusChange(reviewId: number, status: "approved" | "rejected" | "pending") {
    setActionLoading(reviewId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setFeedback(`Review status changed to "${status}"`);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating review");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(reviewId: number) {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    setActionLoading(reviewId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setFeedback("Review deleted successfully");
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting review");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-[#e3e5e7] bg-white p-5 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3e5e7] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#202223]">Customer Reviews</h2>
          <p className="text-[13px] text-[#6d7175]">
            Manage ratings and reviews submitted for this product.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6d7175]">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-[#c9cccf] bg-white px-3 py-1.5 text-[13px] outline-none"
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className="rounded bg-[#e4f5e1] border border-[#b7e4b0] p-3 text-[13px] text-[#006e52]">
          {feedback}
        </div>
      )}

      {/* SUMMARY STATS GRID */}
      <div className="grid gap-6 rounded-lg border border-[#e3e5e7] bg-[#fafbfb] p-4 sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col items-center justify-center border-b border-[#e3e5e7] pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
          <span className="text-4xl font-bold text-[#202223]">
            {summary.average.toFixed(1)} <span className="text-2xl text-amber-500">★</span>
          </span>
          <StarRating rating={summary.average} size="sm" className="mt-2" />
          <p className="mt-1 text-[12px] text-[#6d7175]">
            {summary.total} total reviews
          </p>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const cnt = summary.counts[star as 1 | 2 | 3 | 4 | 5] ?? 0;
            const pct = summary.total > 0 ? (cnt / summary.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-[12px]">
                <span className="w-8 text-[#6d7175] font-medium">{star} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-[#e3e5e7]">
                  <div
                    className="h-full bg-[#00a0ac] rounded transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-medium text-[#202223]">{cnt}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEWS LIST TABLE */}
      {loading ? (
        <p className="py-8 text-center text-[13px] text-[#8c9196]">Loading product reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-[#8c9196]">
          No customer reviews matching current filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-[#e3e5e7]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] text-[11px] uppercase text-[#6d7175]">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-3 py-3">Rating</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id} className="border-t border-[#f1f2f3] hover:bg-[#fafbfb]">
                  <td className="px-4 py-3 font-medium">
                    <p>{rev.customerName}</p>
                    <p className="text-[11px] text-[#6d7175] font-normal">{rev.customerEmail}</p>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <StarRating rating={rev.rating} size="sm" showScore />
                  </td>

                  <td className="px-4 py-3 max-w-md">
                    <p className="text-[13px] leading-relaxed text-[#202223] whitespace-pre-line">
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
                          disabled={actionLoading === rev.id}
                          onClick={() => handleStatusChange(rev.id, "approved")}
                          className="rounded border border-[#c9cccf] bg-white px-2.5 py-1 text-[11px] font-medium text-[#006e52] hover:bg-[#f4f5f7] disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={actionLoading === rev.id}
                          onClick={() => handleStatusChange(rev.id, "rejected")}
                          className="rounded border border-[#c9cccf] bg-white px-2.5 py-1 text-[11px] font-medium text-[#b45309] hover:bg-[#f4f5f7] disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionLoading === rev.id}
                        onClick={() => handleDelete(rev.id)}
                        className="rounded border border-[#ffd6d6] bg-white px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
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
  );
}
