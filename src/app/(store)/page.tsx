import Link from "next/link";
import { HeroBanner, type HeroSlide } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { ProductSlider } from "@/components/product-slider";
import { GROUPS } from "@/lib/catalog";
import { getCategoryOverview, getGroupCounts, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

const HERO_SLIDES: HeroSlide[] = [
  {
    key: "women",
    label: "Women",
    title: "Shalwar kameez — stitched, unstitched & luxury pret",
    copy: "Hand embroidery, premium lawn, boski and couture-grade luxury pret shalwar kameez, tailored for every occasion.",
    image:
      "https://images.pexels.com/photos/29413661/pexels-photo-29413661.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2000",
    href: "/collections/women",
    cta: "Shop women",
    ctaSecondary: "Shop all",
  },
  {
    key: "men",
    label: "Men",
    title: "Stitched, unstitched & elegant eastern tailoring",
    copy: "Ready-made kurtas, premium wash & wear and boski fabric, plus an elegant line for weddings and evenings.",
    image:
      "https://images.pexels.com/photos/28332607/pexels-photo-28332607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2000",
    href: "/collections/men",
    cta: "Shop men",
    ctaSecondary: "Shop all",
  },
  {
    key: "kids",
    label: "Kids",
    title: "Boys, girls & baby — play-proof everyday outfits",
    copy: "Skin-friendly cotton sets, festive eastern wear, night suits and school uniforms for newborns to 14 years.",
    image:
      "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2000",
    href: "/collections/kids",
    cta: "Shop kids",
    ctaSecondary: "Shop all",
  },
  {
    key: "bed",
    label: "Bed",
    title: "Hotel-grade bed linen for every season",
    copy: "Percale and sateen sheet sets, featherlight quilts, duvet covers, pillows and waterproof mattress protectors.",
    image:
      "https://images.pexels.com/photos/7765000/pexels-photo-7765000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1900",
    href: "/collections/bed",
    cta: "Shop bed",
    ctaSecondary: "Shop all",
  },
  {
    key: "bath",
    label: "Bath",
    title: "Zero-twist towels & spa robes",
    copy: "Zero-twist cotton towels, waffle bathrobes, anti-slip mats, shower curtains and complete bath gift sets.",
    image:
      "https://images.pexels.com/photos/20665616/pexels-photo-20665616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1900",
    href: "/collections/bath",
    cta: "Shop bath",
    ctaSecondary: "Shop all",
  },
  {
    key: "accessories",
    label: "Accessories",
    title: "Handcrafted bags, jewellery & footwear",
    copy: "Luxury leather handbags, statement kundan jewellery, silk scarves, handcrafted khussas and stylish eyewear.",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1900",
    href: "/collections/accessories",
    cta: "Shop accessories",
    ctaSecondary: "Shop all",
  },
];

export default async function HomePage() {
  const [featured, arrivals, slider, counts, overview] = await Promise.all([
    listProducts({ featured: true, pageSize: 8, sort: "newest" }),
    listProducts({ pageSize: 8, sort: "newest" }),
    listProducts({ pageSize: 12, sort: "newest", status: "active" }),
    getGroupCounts(),
    getCategoryOverview(),
  ]);

  return (
    <div>
      {/* Rotating department banners: Women · Men · Kids · Bed · Bath (every 4s) */}
      <HeroBanner slides={HERO_SLIDES} />

      {/* Auto-playing slider — newest product first, slides every 3 seconds */}
      <section className="border-b border-sand bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-luxe text-gold uppercase">Latest drops</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">New to old — auto slider</h2>
            </div>
            <p className="text-xs text-ink-soft/70">
              Newest upload first · slides left to right every 3 seconds · hover to pause
            </p>
          </div>
          <div className="mt-10">
            <ProductSlider products={slider.items} />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 text-center md:grid-cols-4">
          {[
            ["Cash on delivery", "Nationwide"],
            ["Free delivery", "Orders above Rs 5,000"],
            ["14 day exchange", "Easy returns"],
            ["Quality checked", "Lahore studio"],
          ].map(([title, sub]) => (
            <div key={title}>
              <p className="text-[12px] font-semibold tracking-[0.16em] uppercase">{title}</p>
              <p className="mt-1 text-xs text-ink-soft/70">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-luxe text-gold uppercase">Shop by department</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Five departments, 25 categories</h2>
          </div>
          <Link href="/collections" className="text-[11px] tracking-[0.2em] uppercase link-underline">
            View all collections
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {GROUPS.map((group) => (
            <Link
              key={group.slug}
              href={`/collections/${group.slug}`}
              className="group relative overflow-hidden rounded-xl bg-cream"
            >
              <div className="aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.image}
                  alt={group.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 w-full p-4 text-cream">
                <p className="font-display text-2xl">{group.name}</p>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-gold-soft uppercase">
                  {group.tagline}
                </p>
                <p className="mt-2 text-xs text-cream/75">{counts[group.slug] ?? 0} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-luxe text-gold uppercase">Featured</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Ridexd highlights</h2>
            </div>
            <Link href="/shop?sort=price-desc" className="text-[11px] tracking-[0.2em] uppercase link-underline">
              Shop luxury edit
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {featured.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category wise strip */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-[11px] tracking-luxe text-gold uppercase">Category wise</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">Browse each department by category</h2>

        <div className="mt-10 space-y-12">
          {GROUPS.map((group) => (
            <div key={group.slug} className="grid gap-6 rounded-2xl border border-sand p-6 lg:grid-cols-[280px_1fr]">
              <div>
                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.image} alt={group.name} className="h-44 w-full object-cover" />
                </div>
                <h3 className="mt-4 font-display text-2xl">{group.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">{group.description}</p>
                <Link
                  href={`/collections/${group.slug}`}
                  className="mt-4 inline-block text-[11px] tracking-[0.2em] text-gold uppercase"
                >
                  Shop {group.name} →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {overview
                  .filter((cat) => cat.groupSlug === group.slug)
                  .map((cat) => {
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                      className="group flex gap-4 rounded-xl border border-transparent p-3 transition hover:border-sand hover:bg-cream"
                    >
                      {cat.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-20 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-16 items-center justify-center rounded bg-sand text-xs text-ink-soft/40">
                          No img
                        </div>
                      )}
                      <div>
                        <p className="text-[15px] font-medium group-hover:text-plum">{cat.name}</p>
                        <p className="text-xs text-ink-soft/70">{cat.tagline}</p>
                        <p className="mt-1 text-[10px] tracking-[0.2em] text-gold uppercase">
                          {cat.productCount} items
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-y border-sand bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-luxe text-gold uppercase">Just landed</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">New arrivals</h2>
            </div>
            <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase link-underline">
              Shop all products
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {arrivals.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/4455836/pexels-photo-4455836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
            alt="Ridexd home essentials"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-[11px] tracking-luxe text-gold uppercase">Bed &amp; bath</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Hotel-grade linen and zero-twist towels, delivered to your door.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft/75">
            Our home textile range covers bed sheets, quilts, duvet covers, pillows, mattress
            protectors, towels, robes, mats, shower curtains and complete bath sets — five categories
            of everyday luxury.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections/bed"
              className="rounded-full bg-ink px-7 py-4 text-[11px] tracking-[0.24em] text-white uppercase"
            >
              Shop bed
            </Link>
            <Link
              href="/collections/bath"
              className="rounded-full border border-ink px-7 py-4 text-[11px] tracking-[0.24em] uppercase"
            >
              Shop bath
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
