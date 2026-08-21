"use client";

import Link from "next/link";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, subtotal, setQuantity, removeLine, count } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div
      className={`fixed inset-0 z-[70] transition ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!drawerOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <p className="text-[12px] tracking-[0.24em] uppercase">Your bag ({count})</p>
          <button type="button" onClick={closeDrawer} className="text-2xl leading-none">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-xl">Your bag is empty</p>
            <p className="text-sm text-ink-soft/70">
              Explore stitched suits, unstitched fabric, luxury pret, kids wear and bed &amp; bath
              essentials.
            </p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="mt-2 rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div
                  key={`${line.productId}-${line.variant}`}
                  className="flex gap-4 border-b border-sand pb-4"
                >
                  {line.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={line.image} alt={line.title} className="h-28 w-20 rounded object-cover" />
                  ) : (
                    <div className="flex h-28 w-20 items-center justify-center rounded bg-sand text-xs text-ink-soft/40">
                      No img
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${line.slug}`} onClick={closeDrawer} className="text-sm font-medium">
                        {line.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeLine(line.productId, line.variant)}
                        className="text-xs text-ink-soft/60 hover:text-plum"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-soft/70">
                      {line.variant ? `Size: ${line.variant}` : "Standard"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-sand">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm"
                          onClick={() => setQuantity(line.productId, line.variant, line.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm"
                          onClick={() => setQuantity(line.productId, line.variant, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatPKR(line.price * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand px-5 py-4">
              {remaining > 0 ? (
                <p className="mb-3 text-xs text-ink-soft/70">
                  Add {formatPKR(remaining)} more for <strong>free delivery</strong>.
                </p>
              ) : (
                <p className="mb-3 text-xs text-emerald-700">You have unlocked free delivery 🎉</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPKR(subtotal)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="rounded-full border border-ink py-3 text-center text-[11px] tracking-[0.2em] uppercase"
                >
                  View bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="rounded-full bg-ink py-3 text-center text-[11px] tracking-[0.2em] text-white uppercase"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
