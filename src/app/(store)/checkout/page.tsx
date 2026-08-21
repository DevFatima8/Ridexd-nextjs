"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";

type Status = "idle" | "loading" | "done" | "error";

export default function CheckoutPage() {
  const { lines, subtotal, clear, ready } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 250;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: String(form.get("customerName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          address: String(form.get("address") ?? ""),
          city: String(form.get("city") ?? ""),
          postalCode: String(form.get("postalCode") ?? ""),
          notes: String(form.get("notes") ?? ""),
          paymentMethod: String(form.get("paymentMethod") ?? "cod"),
          items: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            variant: l.variant,
          })),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; orderNumber?: string; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Order failed");
      setOrderNumber(data.orderNumber ?? "");
      setStatus("done");
      clear();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-[11px] tracking-luxe text-gold uppercase">Order confirmed</p>
        <h1 className="mt-4 font-display text-4xl">Thank you for shopping with Ridexd</h1>
        <p className="mt-5 text-sm text-ink-soft/75">
          Your order <strong className="text-ink">{orderNumber}</strong> has been placed. Our team will
          call you within 24 hours to confirm delivery. You can track the status anytime from the
          Track Order page.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href={`/track?order=${orderNumber}`}
            className="rounded-full bg-ink px-8 py-4 text-[11px] tracking-[0.24em] text-white uppercase"
          >
            Track order
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-ink px-8 py-4 text-[11px] tracking-[0.24em] uppercase"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink-soft/70">
        Cash on delivery, bank transfer or card — pay however suits you.
      </p>

      {ready && lines.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-sand bg-cream p-16 text-center">
          <p className="font-display text-2xl">Your bag is empty</p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-ink px-8 py-4 text-[11px] tracking-[0.24em] text-white uppercase"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-sand p-6">
              <p className="text-[11px] tracking-[0.24em] uppercase">Contact</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field name="customerName" label="Full name" required placeholder="Ayesha Khan" />
                <Field name="email" label="Email" type="email" required placeholder="you@email.com" />
                <Field name="phone" label="Phone" required placeholder="03001234567" />
                <Field name="city" label="City" required placeholder="Lahore" />
              </div>
            </section>

            <section className="rounded-2xl border border-sand p-6">
              <p className="text-[11px] tracking-[0.24em] uppercase">Delivery address</p>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">Address</span>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="House 12, Street 4, Gulberg III"
                    className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="postalCode" label="Postal code" placeholder="54000" />
                  <label className="block">
                    <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">
                      Payment method
                    </span>
                    <select
                      name="paymentMethod"
                      className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                    >
                      <option value="cod">Cash on delivery</option>
                      <option value="bank">Bank transfer</option>
                      <option value="card">Card on delivery</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">
                    Order notes (optional)
                  </span>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Any delivery instructions"
                    className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-sand bg-cream p-6">
            <p className="text-[11px] tracking-[0.24em] uppercase">Order summary</p>
            <div className="mt-5 space-y-4">
              {lines.map((line) => (
                <div key={`${line.productId}-${line.variant}`} className="flex gap-3">
                  {line.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={line.image} alt={line.title} className="h-20 w-16 rounded object-cover" />
                  ) : (
                    <div className="flex h-20 w-16 items-center justify-center rounded bg-sand text-xs text-ink-soft/40">
                      No img
                    </div>
                  )}
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{line.title}</p>
                    <p className="text-xs text-ink-soft/70">
                      {line.variant ? `${line.variant} · ` : ""}Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatPKR(line.price * line.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-sand pt-4 text-sm">
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

            {message && <p className="mt-4 text-sm text-plum">{message}</p>}

            <button
              type="submit"
              disabled={status === "loading" || lines.length === 0}
              className="mt-6 w-full rounded-full bg-ink py-4 text-[11px] tracking-[0.24em] text-white uppercase disabled:opacity-50"
            >
              {status === "loading" ? "Placing order…" : "Place order"}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-ink-soft/70">
              By placing this order you agree to the Ridexd store terms. This is a demo storefront —
              no real payment is captured.
            </p>
          </aside>
        </form>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}
