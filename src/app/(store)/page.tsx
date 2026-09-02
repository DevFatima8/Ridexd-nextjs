import Link from "next/link";
import { HeroBanner, type HeroSlide } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { ProductSlider } from "@/components/product-slider";
import { ScrollReveal } from "@/components/scroll-reveal";
import { GROUPS } from "@/lib/catalog";
import { getCategoryOverview, getGroupCounts, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

const HERO_SLIDES: HeroSlide[] = [
  {
    key: "women",
    label: "Women",
    title: "Shalwar kameez — stitched, unstitched & luxury pret",
    copy: "Hand embroidery, premium lawn, boski and couture-grade luxury pret shalwar kameez, tailored for every occasion.",
    image: "/images/WOMEN.jpg.jpeg",
    href: "/collections/women",
    cta: "Shop women",
    ctaSecondary: "Shop all",
  },
  {
    key: "men",
    label: "Men",
    title: "Stitched, unstitched & elegant eastern tailoring",
    copy: "Ready-made kurtas, premium wash & wear and boski fabric, plus an elegant line for weddings and evenings.",
    image: "/images/MENS%20BURNER%20N.jpg.jpeg",
    href: "/collections/men",
    cta: "Shop men",
    ctaSecondary: "Shop all",
  },
  {
    key: "kids",
    label: "Kids",
    title: "Boys, girls & baby — play-proof everyday outfits",
    copy: "Skin-friendly cotton sets, festive eastern wear, night suits and school uniforms for newborns to 14 years.",
    image: "/images/KIDS%20N.jpg.jpeg",
    href: "/collections/kids",
    cta: "Shop kids",
    ctaSecondary: "Shop all",
  },
  {
    key: "bed",
    label: "Bed",
    title: "Hotel-grade bed linen for every season",
    copy: "Percale and sateen sheet sets, featherlight quilts, duvet covers, pillows and waterproof mattress protectors.",
    image: "/images/BED.jpg.jpeg",
    href: "/collections/bed",
    cta: "Shop bed",
    ctaSecondary: "Shop all",
  },
  {
    key: "bath",
    label: "Bath",
    title: "Zero-twist towels & spa robes",
    copy: "Zero-twist cotton towels, waffle bathrobes, anti-slip mats, shower curtains and complete bath gift sets.",
    image: "/images/BATH.jpg.jpeg",
    href: "/collections/bath",
    cta: "Shop bath",
    ctaSecondary: "Shop all",
  },
];

const TRUST_ITEMS = [
  {
    icon: "🚚",
    title: "Cash on delivery",
    sub: "Nationwide service",
  },
  {
    icon: "✨",
    title: "Free delivery",
    sub: "Orders above Rs 5,000",
  },
  {
    icon: "🔄",
    title: "14 day exchange",
    sub: "Hassle-free easy returns",
  },
  {
    icon: "🏅",
    title: "Quality checked",
    sub: "Handpicked Lahore studio",
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
    <div className="w-full overflow-hidden bg-white text-ink">
      {/* Rotating department banners */}
      <HeroBanner slides={HERO_SLIDES} />

      {/* Fresh Arrivals Slider */}
      <section className="border-b border-sand bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
                  Latest drops
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">Fresh Arrivals</h2>
              </div>
              <Link
                href="/shop?sort=newest"
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase link-underline inline-block self-start sm:self-auto"
              >
                Explore all drops →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150} className="mt-8 sm:mt-10">
            <ProductSlider products={slider.items} />
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-sand bg-cream py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {TRUST_ITEMS.map((item, idx) => (
              <ScrollReveal
                key={item.title}
                animation={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={(idx % 2) * 80}
              >
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white/60 border border-sand/40 transition-transform duration-300 hover:scale-105">
                  <span className="text-xl sm:text-2xl mb-1">{item.icon}</span>
                  <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.14em] uppercase text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-ink-soft/75">{item.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Department */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
                Shop by department
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">
                Five departments, 25 categories
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase link-underline inline-block self-start sm:self-auto"
            >
              View all collections →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {GROUPS.map((group, idx) => (
            <ScrollReveal
              key={group.slug}
              animation={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={(idx % 2) * 80}
            >
              <Link
                href={`/collections/${group.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-cream shadow-xs transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={group.image}
                    alt={group.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                <div className="absolute bottom-0 w-full p-3.5 sm:p-5 text-cream">
                  <p className="font-display text-xl sm:text-2xl font-normal leading-tight">
                    {group.name}
                  </p>
                  <p className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase line-clamp-1">
                    {group.tagline}
                  </p>
                  <div className="mt-2.5 inline-block rounded-full bg-black/40 px-2.5 py-0.5 backdrop-blur-md">
                    <p className="text-[10px] text-cream/90 font-medium">
                      {counts[group.slug] ?? 0} products
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Highlights */}
      <section className="bg-cream py-14 sm:py-20 lg:py-24 border-y border-sand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
                  Featured
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">Ridexd highlights</h2>
              </div>
              <Link
                href="/shop?sort=price-desc"
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase link-underline inline-block self-start sm:self-auto"
              >
                Shop luxury edit →
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
            {featured.items.map((product, idx) => (
              <ScrollReveal
                key={product.id}
                animation={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={(idx % 2) * 90}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Category Wise Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <ScrollReveal animation="fade-up">
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
            Category wise
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">
            Browse each department by category
          </h2>
        </ScrollReveal>

        <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">
          {GROUPS.map((group, groupIdx) => (
            <ScrollReveal
              key={group.slug}
              animation={groupIdx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={80}
            >
              <div className="grid gap-6 rounded-2xl border border-sand bg-white p-4 sm:p-6 lg:grid-cols-[280px_1fr] shadow-xs hover:border-gold/30 transition-colors">
                <div>
                  <div className="overflow-hidden rounded-xl bg-cream aspect-[16/9] sm:aspect-auto sm:h-44">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={group.image}
                      alt={group.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-xl sm:text-2xl">{group.name}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft/75 font-light">
                    {group.description}
                  </p>
                  <Link
                    href={`/collections/${group.slug}`}
                    className="mt-4 inline-flex items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-gold uppercase hover:underline"
                  >
                    Shop {group.name} →
                  </Link>
                </div>

                <div className="grid gap-2.5 sm:gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-3">
                  {overview
                    .filter((cat) => cat.groupSlug === group.slug)
                    .map((cat, catIdx) => {
                      return (
                        <ScrollReveal
                          key={cat.id}
                          animation={catIdx % 2 === 0 ? "slide-left" : "slide-right"}
                          delay={(catIdx % 2) * 70}
                        >
                          <Link
                            href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                            className="group flex flex-col sm:flex-row gap-2 sm:gap-3.5 rounded-xl border border-sand/60 p-2.5 sm:p-3 transition-all duration-300 hover:border-gold/40 hover:bg-cream/50 hover:shadow-xs h-full"
                          >
                            {cat.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={cat.image}
                                alt={cat.name}
                                loading="lazy"
                                className="h-24 sm:h-20 w-full sm:w-16 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-24 sm:h-20 w-full sm:w-16 shrink-0 items-center justify-center rounded-lg bg-sand text-xs text-ink-soft/40">
                                No img
                              </div>
                            )}
                            <div className="flex flex-col justify-center">
                              <p className="text-xs sm:text-sm font-semibold text-ink transition-colors group-hover:text-plum line-clamp-1">
                                {cat.name}
                              </p>
                              <p className="text-[11px] sm:text-xs text-ink-soft/70 line-clamp-1 mt-0.5">{cat.tagline}</p>
                              <p className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
                                {cat.productCount} items
                              </p>
                            </div>
                          </Link>
                        </ScrollReveal>
                      );
                    })}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="border-y border-sand bg-cream py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
                  Just landed
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">New arrivals</h2>
              </div>
              <Link
                href="/shop"
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase link-underline inline-block self-start sm:self-auto"
              >
                Shop all products →
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
            {arrivals.items.map((product, idx) => (
              <ScrollReveal
                key={product.id}
                animation={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={(idx % 2) * 90}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Bed & Bath Feature */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2 rounded-3xl border border-sand bg-white p-6 sm:p-10 shadow-sm">
          <ScrollReveal animation="slide-left">
            <div className="overflow-hidden rounded-2xl aspect-[4/3] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/4455836/pexels-photo-4455836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Ridexd home essentials"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="slide-right">
            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold uppercase">
                Bed &amp; bath
              </p>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-ink leading-tight">
                Hotel-grade linen and zero-twist towels, delivered to your door.
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-ink-soft/75 font-light">
                Our home textile range covers bed sheets, quilts, duvet covers, pillows, mattress
                protectors, towels, robes, mats, shower curtains and complete bath sets — five
                categories of everyday luxury.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/collections/bed"
                  className="rounded-full bg-ink px-7 py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-white uppercase transition-all duration-300 hover:bg-gold hover:scale-105 active:scale-95 shadow-md"
                >
                  Shop bed
                </Link>
                <Link
                  href="/collections/bath"
                  className="rounded-full border border-ink px-7 py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase transition-all duration-300 hover:bg-ink hover:text-white hover:scale-105 active:scale-95"
                >
                  Shop bath
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

