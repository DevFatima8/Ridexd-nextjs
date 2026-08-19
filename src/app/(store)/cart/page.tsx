"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeLine, ready } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 250;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl">Shopping bag</h1>
      <p className="mt-2 text-sm text-ink-soft/70">
        {ready ? `${lines.length} line item(s)` : "Loading your bag…"}
      </p>

      {ready && lines.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-sand bg-cream p-16 text-center">
          <p className="font-display text-2xl">Your bag is empty</p>
          <p className="mt-2 text-sm text-ink-soft/70">
            Browse the new season across women, men, kids, bed and bath.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-ink px-8 py-4 text-[11px] tracking-[0.24em] text-white uppercase"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-sand border-y border-sand">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.variant}`} className="flex gap-5 py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.image} alt={line.title} className="h-36 w-28 rounded object-cover" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${line.slug}`} className="text-lg font-medium hover:text-plum">
                        {line.title}
                      </Link>
                      <p className="mt-1 text-xs text-ink-soft/70">
                        {line.variant ? `Size: ${line.variant} · ` : ""}
                        {formatPKR(line.price)} each
                      </p>
                    </div>
                    <p className="font-semibold">{formatPKR(line.price * line.quantity)}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex items-center border border-sand">
                      <button
                        type="button"
                        className="px-3.5 py-2"
                        onClick={() => setQuantity(line.productId, line.variant, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="px-3.5 py-2"
                        onClick={() => setQuantity(line.productId, line.variant, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId, line.variant)}
                      className="text-xs tracking-[0.16em] text-ink-soft/60 uppercase hover:text-plum"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-sand bg-cream p-6">
            <p className="text-[11px] tracking-[0.24em] uppercase">Order summary</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatPKR(subtotal + shipping)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-ink py-4 text-center text-[11px] tracking-[0.24em] text-white uppercase"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block rounded-full border border-ink py-4 text-center text-[11px] tracking-[0.24em] uppercase"
            >
              Continue shopping
            </Link>
            <p className="mt-5 text-xs leading-relaxed text-ink-soft/70">
              Cash on delivery, bank transfer and card payments accepted. 14 day easy exchange on all
              full price items.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
