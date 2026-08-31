"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductReviewRow } from "@/db/schema";
import type { ProductReviewSummary } from "@/lib/queries";
import { CustomerAuthModal } from "./customer-auth-modal";
import { StarRating } from "./star-rating";

interface ProductReviewsProps {
  productId: number;
  productTitle: string;
}

type SortOption = "newest" | "highest" | "lowest";

export function ProductReviews({ productId, productTitle }: ProductReviewsProps) {
  const [summary, setSummary] = useState<ProductReviewSummary>({
    average: 0,
    total: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [reviews, setReviews] = useState<ProductReviewRow[]>([]);
  const [userReview, setUserReview] = useState<ProductReviewRow | null>(null);
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchReviews = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}/reviews?page=${currentPage}&pageSize=5`);
        if (!res.ok) return;
        const data = await res.json();
        setSummary(data.summary ?? { average: 0, total: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
        setUserReview(data.userReview ?? null);
        setCustomer(data.customer ?? null);
        setIsVerifiedBuyer(Boolean(data.isVerifiedBuyer));

        const fetchedItems: ProductReviewRow[] = data.reviews ?? [];
        setHasMore(data.page < data.pageCount);
        setPage(data.page);

        if (append) {
          setReviews((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newItems = fetchedItems.filter((r) => !ids.has(r.id));
            return [...prev, ...newItems];
          });
        } else {
          setReviews(fetchedItems);
        }

        // If customer already submitted review, populate form
        if (data.userReview) {
          setSelectedRating(data.userReview.rating);
          setComment(data.userReview.comment);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    },
    [productId],
  );

  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  function handleStartReview() {
    if (!customer) {
      setShowAuthModal(true);
    } else {
      setIsFormOpen(true);
    }
  }

  function handleAuthSuccess(cust: { name: string; email: string }) {
    setCustomer(cust);
    setIsFormOpen(true);
    fetchReviews(1, false);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    setFeedback(null);

    if (selectedRating < 1 || selectedRating > 5) {
      setValidationError("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      setValidationError("Please write a review comment (at least 3 characters).");
      return;
    }

    if (!customer) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          rating: selectedRating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to submit review");
      }

      setFeedback({ type: "success", message: data.message ?? "Review submitted successfully!" });
      setIsFormOpen(false);
      fetchReviews(1, false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteReview() {
    if (!userReview || !customer) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    setDeleting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/products/${productId}/reviews?reviewId=${userReview.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to delete review");
      }

      setUserReview(null);
      setSelectedRating(0);
      setComment("");
      setIsFormOpen(false);
      setFeedback({ type: "success", message: "Your review has been deleted." });
      fetchReviews(1, false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete review",
      });
    } finally {
      setDeleting(false);
    }
  }

  // Sorted reviews calculation
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section className="mt-16 border-t border-sand pt-12">
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-luxe text-gold uppercase">Customer Feedback</p>
          <h2 className="mt-1 font-display text-3xl">Ratings &amp; Reviews</h2>
        </div>

        <button
          type="button"
          onClick={handleStartReview}
          className="rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase transition hover:bg-gold"
        >
          {userReview ? "Edit your review" : "Write a review"}
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-6 rounded-xl p-4 text-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* RATING SUMMARY CARD */}
      <div className="mt-8 grid gap-8 rounded-2xl border border-sand bg-cream/50 p-6 md:grid-cols-[220px_1fr] md:p-8">
        <div className="flex flex-col items-center justify-center text-center border-b border-sand pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <span className="font-display text-5xl font-semibold text-ink">
            {summary.average.toFixed(1)}
          </span>
          <StarRating rating={summary.average} size="lg" className="mt-2" />
          <p className="mt-2 text-xs font-medium text-ink-soft/75">
            Based on {summary.total} {summary.total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.counts[star as 1 | 2 | 3 | 4 | 5] ?? 0;
            const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-medium text-ink-soft/80">{star} ★</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-ink-soft/60">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM SECTION */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-8 rounded-2xl border border-gold/40 bg-white p-6 md:p-8 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h3 className="font-display text-xl">
              {userReview ? "Edit your review" : "Write a review"}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-ink-soft hover:text-ink uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          {customer && (
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-ink-soft/80">
              <p>
                Posting as <strong className="text-ink">{customer.name}</strong> ({customer.email})
              </p>
              {isVerifiedBuyer && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                  Verified Buyer
                </span>
              )}
            </div>
          )}

          {validationError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {validationError}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-ink-soft/70 uppercase">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex items-center gap-3">
                <StarRating
                  rating={selectedRating}
                  readOnly={false}
                  size="lg"
                  onChange={(r) => setSelectedRating(r)}
                />
                <span className="text-xs font-semibold text-gold uppercase">
                  {selectedRating > 0 ? `${selectedRating} of 5 Stars` : "Select rating"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold tracking-wider text-ink-soft/70 uppercase">
                  Review Comment <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-ink-soft/50">
                  {comment.length}/2000 chars
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your honest review about the fabric, quality, sizing, and overall experience…"
                className="mt-2 w-full rounded-xl border border-sand bg-cream p-4 text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {userReview && (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  disabled={deleting}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Delete this review"}
                </button>
              )}
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full border border-sand px-6 py-2.5 text-[11px] tracking-wider uppercase hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-ink px-8 py-2.5 text-[11px] tracking-wider text-white uppercase hover:bg-gold transition disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : userReview ? "Update review" : "Submit review"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* REVIEWS LIST HEADER */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-4">
        <h3 className="font-display text-xl text-ink">
          Reviews ({summary.total})
        </h3>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-soft/70">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-sand bg-cream px-3 py-1.5 outline-none focus:border-gold text-xs"
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
        )}
      </div>

      {/* REVIEWS LIST */}
      {loading && reviews.length === 0 ? (
        <div className="py-12 text-center text-xs text-ink-soft/60">
          Loading product reviews…
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-sand bg-cream/30 p-12 text-center">
          <p className="font-display text-lg text-ink">No reviews yet</p>
          <p className="mt-1 text-xs text-ink-soft/70">
            Be the first customer to review “{productTitle}”!
          </p>
          <button
            type="button"
            onClick={handleStartReview}
            className="mt-5 rounded-full bg-ink px-6 py-2.5 text-[11px] tracking-wider text-white uppercase hover:bg-gold transition"
          >
            Write the first review
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6 divide-y divide-sand">
          {sortedReviews.map((rev) => {
            const isUserOwn = customer && rev.customerEmail.toLowerCase() === customer.email.toLowerCase();
            const initials = rev.customerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={rev.id} className="pt-6 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display text-sm font-semibold text-gold">
                      {initials || "C"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-ink">{rev.customerName}</span>
                        {isUserOwn && (
                          <span className="rounded bg-ink px-2 py-0.5 text-[9px] text-white uppercase tracking-wider">
                            You
                          </span>
                        )}
                        {rev.status === "pending" && (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-800 uppercase tracking-wider">
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-soft/50 mt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString("en-PK", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <StarRating rating={rev.rating} size="sm" />
                    {isUserOwn && (
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(true)}
                        className="mt-1 text-[11px] text-gold hover:underline"
                      >
                        Edit review
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft/90">
                  {rev.comment}
                </p>
              </div>
            );
          })}

          {hasMore && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={() => fetchReviews(page + 1, true)}
                className="rounded-full border border-ink px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-white transition"
              >
                Load more reviews
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
