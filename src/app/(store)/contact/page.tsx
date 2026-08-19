"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-[11px] tracking-luxe text-gold uppercase">Customer care</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">Get in touch</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form
          className="rounded-2xl border border-sand p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="p-6 text-center">
              <p className="font-display text-2xl">Message received</p>
              <p className="mt-2 text-sm text-ink-soft/70">
                Our support team replies within one working day.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">Name</span>
                <input
                  required
                  className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">Email</span>
                <input
                  required
                  type="email"
                  className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs tracking-[0.12em] text-ink-soft/70 uppercase">Message</span>
                <textarea
                  required
                  rows={5}
                  className="mt-2 w-full rounded border border-sand bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
              </label>
              <button
                type="submit"
                className="sm:col-span-2 rounded-full bg-ink py-4 text-[11px] tracking-[0.24em] text-white uppercase"
              >
                Send message
              </button>
            </div>
          )}
        </form>

        <aside className="space-y-6 rounded-2xl bg-cream p-6 text-sm">
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase">WhatsApp</p>
            <p className="mt-2">0300-000-0000 (Mon–Sat, 10am–8pm)</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase">Email</p>
            <p className="mt-2">support@ridexd.com</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase">Studio</p>
            <p className="mt-2">Ridexd Fulfilment Hub, Gulberg III, Lahore, Pakistan</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase">Delivery</p>
            <p className="mt-2">2–5 working days nationwide · Rs 250 flat · free above Rs 5,000</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
