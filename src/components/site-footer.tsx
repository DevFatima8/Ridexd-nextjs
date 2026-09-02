import Link from "next/link";
import { GROUPS, SOCIAL_LINKS } from "@/lib/catalog";
import type { CategoryWithCount } from "@/lib/queries";

export function SiteFooter({ categories = [] }: { categories?: CategoryWithCount[] }) {
  const departmentGroups = GROUPS.filter((g) => g.slug !== "bed" && g.slug !== "bath");

  return (
    <footer className="mt-16 sm:mt-24 border-t border-sand bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-start">
          {/* Brand Info & Socials Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <img
                src="/logo.png"
                alt="Ridexd.com"
                className="h-10 md:h-12 w-auto object-contain brightness-110 drop-shadow"
              />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-cream/80 font-light">
              Ridexd.com is a modern eastern lifestyle store — shalwar kameez for women and men,
              kidswear, luxury accessories and bed &amp; bath textiles, delivered across Pakistan.
            </p>

            {/* Social Links */}
            <div className="pt-2 space-y-2">
              <p className="text-[10px] tracking-[0.24em] text-gold-soft uppercase font-semibold">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream transition-all duration-300 hover:bg-gold hover:text-white hover:scale-110 active:scale-95"
                  title="Instagram"
                >
                  📸
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream transition-all duration-300 hover:bg-gold hover:text-white hover:scale-110 active:scale-95"
                  title="Facebook"
                >
                  📘
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream transition-all duration-300 hover:bg-gold hover:text-white hover:scale-110 active:scale-95"
                  title="TikTok"
                >
                  🎵
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] tracking-[0.2em] text-cream/50 uppercase font-medium">
              <span>COD</span>
              <span>·</span>
              <span>Bank transfer</span>
              <span>·</span>
              <span>Cards</span>
            </div>
          </div>

          {/* Department Columns: Women, Men, Kids, Accessories */}
          {departmentGroups.map((group) => {
            const removedSlugs = new Set(["shawls-dupattas", "1-pc", "separate-pieces"]);
            const filteredCategories = categories.filter(
              (cat) => cat.groupSlug === group.slug && !cat.parentSlug && !removedSlugs.has(cat.categorySlug),
            );

            return (
              <div key={group.slug} className="space-y-3">
                <Link
                  href={`/collections/${group.slug}`}
                  className="inline-block text-[11px] font-semibold tracking-[0.24em] text-gold-soft uppercase transition-colors hover:text-white"
                >
                  {group.name}
                </Link>
                <ul className="space-y-2 text-xs text-cream/75">
                  {filteredCategories.slice(0, 5).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                        className="transition-colors duration-200 hover:text-white hover:underline"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-6 text-xs text-cream/60 sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Ridexd.com — All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              Instagram
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              Facebook
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              TikTok
            </a>
            <span className="hidden sm:inline">·</span>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/track" className="transition-colors hover:text-white">
              Track order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

