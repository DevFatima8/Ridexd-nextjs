"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GROUPS } from "@/lib/catalog";
import type { CategoryWithCount } from "@/lib/queries";
import { useCart } from "./cart-provider";

export function SiteHeader({ categories = [] }: { categories?: CategoryWithCount[] }) {
  const { count, openDrawer } = useCart();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    queueMicrotask(() => {
      setMobileOpen(false);
      setOpenMenu(null);
    });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function catsFor(group: string) {
    return categories.filter((c) => c.groupSlug === group);
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (mobileOpen) setMobileOpen(false);
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
          <p className="hidden sm:block">Free delivery on orders above PKR 5,000</p>
          <p className="sm:hidden">Free delivery above PKR 5,000</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="transition-colors hover:text-gold-soft">Contact</Link>
            <Link href="/track" className="transition-colors hover:text-gold-soft">Track order</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`border-b border-sand bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(16,19,25,0.08)] py-1.5" : "py-2"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-transparent hover:border-sand lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`block h-0.5 w-full bg-ink transition-transform duration-300 ${
                  mobileOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-ink transition-opacity duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-ink transition-transform duration-300 ${
                  mobileOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-0 py-0 group">
            <img
              src="/logo.png"
              alt="Ridexd.com"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              style={{
                filter:
                  "drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(0 0 2px rgba(0,0,0,0.5))",
              }}
            />
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden items-center gap-7 text-[12px] lg:text-[13px] font-semibold tracking-[0.14em] uppercase lg:flex">
            <Link href="/" className="link-underline py-2">Home</Link>
            {GROUPS.map((group, index) => {
              const hasSubcategories = catsFor(group.slug).some((c) => c.parentSlug);
              const alignClass =
                group.slug === "women" || index === 0
                  ? "left-0"
                  : group.slug === "men" || index === 1
                  ? "left-0 -translate-x-3"
                  : group.slug === "accessories" || index === GROUPS.length - 1
                  ? "right-0"
                  : group.slug === "bath" || index === GROUPS.length - 2
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";

              const widthClass = hasSubcategories
                ? "w-[660px] max-w-[calc(100vw-32px)]"
                : "w-[460px] max-w-[calc(100vw-32px)]";

              return (
                <div
                  key={group.slug}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(group.slug)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link href={`/collections/${group.slug}`} className="link-underline inline-block py-2">
                    {group.name}
                  </Link>
                  {openMenu === group.slug && (
                    <div className={`absolute top-full z-50 pt-2 ${alignClass}`}>
                      <div className={`${widthClass} rounded-xl border border-sand bg-white p-6 shadow-[0_20px_60px_rgba(16,19,25,0.14)] animate-fade-in`}>
                        <p className="mb-4 text-[10px] tracking-[0.28em] text-gold uppercase font-semibold">{group.tagline}</p>
                        {hasSubcategories ? (
                          <div className="grid grid-cols-3 gap-6 text-left">
                            {catsFor(group.slug)
                              .filter((c) => !c.parentSlug)
                              .map((parent) => {
                                const subItems = catsFor(group.slug).filter(
                                  (c) => c.parentSlug === parent.categorySlug,
                                );
                                return (
                                  <div key={parent.id} className="space-y-1.5">
                                    <Link
                                      href={`/shop?group=${group.slug}&category=${parent.categorySlug}`}
                                      className="block text-[13px] font-bold text-ink hover:text-gold"
                                    >
                                      {parent.name}
                                    </Link>
                                    {subItems.length > 0 && (
                                      <div className="space-y-1 border-l border-sand/60 pl-2">
                                        {subItems.map((sub) => (
                                          <Link
                                            key={sub.id}
                                            href={`/shop?group=${group.slug}&category=${parent.categorySlug}&subcategory=${sub.categorySlug}`}
                                            className="block text-[12px] text-ink-soft/80 transition hover:text-ink"
                                          >
                                            {sub.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {catsFor(group.slug).map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                                className="group rounded-lg border border-transparent px-3 py-2 transition hover:border-sand hover:bg-cream"
                              >
                                <span className="block text-[13px] font-semibold text-ink">{cat.name}</span>
                                <span className="block text-[11px] text-ink-soft/70">
                                  {cat.tagline} · {cat.productCount} items
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                        <Link
                          href={`/collections/${group.slug}`}
                          className="mt-5 inline-block text-[11px] font-semibold tracking-[0.2em] text-gold uppercase hover:underline"
                        >
                          Shop all {group.name} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link href="/shop" className="link-underline py-2">Shop</Link>
            <Link href="/about" className="link-underline py-2">About</Link>
            <Link href="/contact" className="link-underline py-2">Contact</Link>
          </nav>

          {/* Search & Shopping Bag */}
          <div className="flex items-center gap-3">
            <form onSubmit={submitSearch} className="hidden items-center md:flex">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-36 rounded-full border border-sand bg-cream px-4 py-2 text-xs text-ink placeholder:text-ink-soft/50 outline-none transition-all duration-300 focus:w-52 focus:border-gold focus:bg-white"
                />
              </div>
            </form>
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex items-center justify-center rounded-full border border-ink bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 shadow-sm"
            >
              Bag
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-white shadow-xs">
                {count}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm border-r border-sand bg-white shadow-2xl overflow-y-auto px-5 pb-8 pt-20 animate-fade-in">
            <form onSubmit={submitSearch} className="mb-6">
              <div className="flex items-center rounded-full border border-sand bg-cream px-4 py-2.5">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft/50 outline-none"
                />
                <button type="submit" className="text-xs text-gold uppercase font-semibold">
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Department Links */}
            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold tracking-[0.16em] uppercase text-ink hover:text-gold"
              >
                Home
              </Link>
              {GROUPS.map((group) => (
                <div key={group.slug} className="border-b border-sand/60 pb-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/collections/${group.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-semibold tracking-[0.16em] uppercase text-ink hover:text-gold"
                    >
                      {group.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedGroup(expandedGroup === group.slug ? null : group.slug)}
                      className="px-2 py-1 text-xs text-gold font-bold"
                    >
                      {expandedGroup === group.slug ? "−" : "+"}
                    </button>
                  </div>

                  {expandedGroup === group.slug && (
                    <div className="mt-2.5 grid grid-cols-2 gap-2 pl-2">
                      {catsFor(group.slug)
                        .filter((c) => !c.parentSlug)
                        .map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-xs text-ink-soft/80 hover:text-plum py-1"
                          >
                            {cat.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="space-y-3 pt-3 text-xs tracking-[0.18em] uppercase font-semibold text-ink">
                <Link href="/shop" onClick={() => setMobileOpen(false)} className="block hover:text-gold">
                  Shop All Products
                </Link>
                <Link href="/about" onClick={() => setMobileOpen(false)} className="block hover:text-gold">
                  About Us
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="block hover:text-gold">
                  Contact Us
                </Link>
                <Link href="/track" onClick={() => setMobileOpen(false)} className="block hover:text-gold">
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

