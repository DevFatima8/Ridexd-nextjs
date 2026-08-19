import Link from "next/link";
import { GROUPS } from "@/lib/catalog";

export const metadata = {
  title: "About Ridexd",
  description:
    "Ridexd.com is a Pakistan based eastern lifestyle store delivering women, men, kids, bed and bath essentials.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-[11px] tracking-luxe text-gold uppercase">Our story</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        A modern eastern lifestyle store, built in Pakistan.
      </h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <p className="text-sm leading-relaxed text-ink-soft/80">
          Ridexd.com started with one idea: premium eastern wear and home textiles should be easy to
          buy online. We work directly with mills and embroidery units in Faisalabad, Lahore and
          Karachi, which means better fabric at a better price — and full control over quality.
        </p>
        <p className="text-sm leading-relaxed text-ink-soft/80">
          Today the store is organised into five departments — women, men, kids, bed and bath — and
          every department is split into five focused categories so you can find exactly what you
          need in seconds.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {GROUPS.map((group) => (
          <Link
            key={group.slug}
            href={`/collections/${group.slug}`}
            className="rounded-xl border border-sand p-5 transition hover:bg-cream"
          >
            <p className="font-display text-xl">{group.name}</p>
            <p className="mt-2 text-xs text-ink-soft/70">{group.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["25 categories", "Every department broken into five focused collections."],
          ["Quality checked", "Each piece inspected in our Lahore studio before dispatch."],
          ["Nationwide COD", "Delivery in 2–5 working days, cash on delivery available."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl bg-cream p-6">
            <p className="text-[12px] font-semibold tracking-[0.16em] uppercase">{title}</p>
            <p className="mt-3 text-sm text-ink-soft/75">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
