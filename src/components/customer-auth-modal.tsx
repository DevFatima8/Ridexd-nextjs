"use client";

import { useState } from "react";

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: { name: string; email: string }) => void;
}

export function CustomerAuthModal({ isOpen, onClose, onSuccess }: CustomerAuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter your full name");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to save customer details");
      }
      onSuccess({ name: cleanName, email: cleanEmail });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-sand bg-white p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-luxe text-gold uppercase">Customer Identity</p>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-ink text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        <h2 className="mt-2 font-display text-2xl">Sign in to write a review</h2>
        <p className="mt-1 text-xs text-ink-soft/75">
          Enter your name and email to submit and manage your review for this product.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-ink-soft/70 uppercase">
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              className="mt-1.5 w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-ink-soft/70 uppercase">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ayesha@example.com"
              className="mt-1.5 w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <p className="mt-1 text-[11px] text-ink-soft/60">
              Your email will be used to verify your review and allow you to edit it later.
            </p>
          </div>

          <div className="mt-6 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-sand px-5 py-3 text-[11px] tracking-wider uppercase hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-ink px-5 py-3 text-[11px] tracking-wider text-white uppercase hover:bg-gold transition disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
