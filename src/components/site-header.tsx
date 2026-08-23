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
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] tracking-[0.18em] uppercase">
          <p className="hidden sm:block">Free delivery on orders above PKR 5,000</p>
          <p className="sm:hidden">Free delivery above PKR 5,000</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-gold-soft">Contact</Link>
            <Link href="/track" className="hover:text-gold-soft">Track order</Link>
            <Link href="/admin" className="hover:text-gold-soft">Admin</Link>
          </div>
        </div>
      </div>

      <div
        className={`border-b border-sand bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_8px_30px_rgba(16,19,25,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
            <span className="mt-1.5 block h-0.5 w-4 bg-ink" />
          </button>

          <Link href="/" className="flex items-center gap-2 py-1">
            <img
              src="/logo.png"
              alt="Ridexd.com"
              className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105"
              style={{
                filter:
                  "drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(0 0 2px rgba(0,0,0,0.5))",
              }}
            />
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-[0.12em] uppercase lg:flex">
            <Link href="/" className="link-underline py-2">Home</Link>
            {GROUPS.map((group) => (
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
                  <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 border border-sand bg-white p-6 shadow-[0_20px_60px_rgba(16,19,25,0.14)]">
                    <p className="mb-4 text-[10px] tracking-[0.28em] text-gold uppercase">{group.tagline}</p>
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
                    <Link
                      href={`/collections/${group.slug}`}
                      className="mt-4 inline-block text-[11px] tracking-[0.2em] text-gold uppercase"
                    >
                      Shop all {group.name} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <Link href="/shop" className="link-underline py-2">Shop</Link>
            <Link href="/about" className="link-underline py-2">About</Link>
            <Link href="/contact" className="link-underline py-2">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={submitSearch} className="hidden items-center md:flex">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-40 rounded-full border border-sand bg-cream px-4 py-2 text-sm outline-none transition-all focus:w-56 focus:border-gold"
              />
            </form>
            <button
              type="button"
              onClick={openDrawer}
              className="relative rounded-full border border-ink px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition hover:bg-ink hover:text-white"
            >
              Bag
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-white">
                {count}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-sand bg-white px-4 pb-6 lg:hidden">
            <form onSubmit={submitSearch} className="py-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-full border border-sand bg-cream px-4 py-2 text-sm outline-none"
              />
            </form>
            <div className="space-y-4">
              {GROUPS.map((group) => (
                <div key={group.slug}>
                  <Link href={`/collections/${group.slug}`} className="text-[13px] font-semibold tracking-[0.16em] uppercase">
                    {group.name}
                  </Link>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {catsFor(group.slug).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                        className="text-sm text-ink-soft"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-4 border-t border-sand pt-4 text-[13px] tracking-[0.16em] uppercase">
                <Link href="/shop">Shop all</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/track">Track</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
