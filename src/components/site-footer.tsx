import Link from "next/link";
import { GROUPS, SOCIAL_LINKS } from "@/lib/catalog";
import type { CategoryWithCount } from "@/lib/queries";

export function SiteFooter({ categories = [] }: { categories?: CategoryWithCount[] }) {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Ridexd.com"
              className="h-10 md:h-12 w-auto object-contain brightness-110 drop-shadow"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Ridexd.com is a modern eastern lifestyle store — shalwar kameez for women and men,
            kidswear and complete bed &amp; bath textiles, delivered across Pakistan.
          </p>
          
          {/* Social Links */}
          <div className="mt-5 space-y-2">
            <p className="text-[10px] tracking-[0.24em] text-gold-soft uppercase font-semibold">Follow Us</p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cream transition hover:bg-gold hover:text-white"
                title="Instagram"
              >
                📸
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cream transition hover:bg-gold hover:text-white"
                title="Facebook"
              >
                📘
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cream transition hover:bg-gold hover:text-white"
                title="TikTok"
              >
                🎵
              </a>
            </div>
          </div>

          <div className="mt-6 flex gap-3 text-[11px] tracking-[0.2em] text-cream/60 uppercase">
            <span>COD</span>
            <span>·</span>
            <span>Bank transfer</span>
            <span>·</span>
            <span>Cards</span>
          </div>
        </div>

        {GROUPS.slice(0, 3).map((group) => (
          <div key={group.slug}>
            <p className="text-[11px] tracking-[0.24em] text-gold-soft uppercase">{group.name}</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/75">
              {categories
                .filter((cat) => cat.groupSlug === group.slug)
                .map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?group=${group.slug}&category=${cat.categorySlug}`}
                      className="hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ridexd.com — All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" className="hover:text-white">TikTok</a>
            <span>·</span>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/track" className="hover:text-white">Track order</Link>
            <Link href="/admin" className="hover:text-white">Admin panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
