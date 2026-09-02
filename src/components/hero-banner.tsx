"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = {
  key: string;
  label: string;
  title: string;
  copy: string;
  image: string;
  href: string;
  cta: string;
  ctaSecondary: string;
};

/**
 * Five rotating department banners (Women · Men · Kids · Bed · Bath).
 * Auto-advances every 4 seconds with a smooth cross-fade + slide.
 * The banner keeps rotating — hovering never pauses it — and the season year
 * is always the live current year (updates automatically each year).
 */
export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  // live year — rolls over automatically (2026 → 2027 → 2028 …)
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const yearTimer = setInterval(() => setYear(new Date().getFullYear()), 60 * 1000);
    return () => clearInterval(yearTimer);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function go(next: number) {
    setActive((next + slides.length) % slides.length);
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-ink h-[600px] sm:h-[700px] md:h-[780px] lg:h-[850px] flex items-center"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.key}
          aria-hidden={index !== active}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Main Hero Background Image - full width & height cover */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.label}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
              index === active ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/30 pointer-events-none" />
        </div>
      ))}

      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 py-16 text-cream">
        {slides.map((slide, index) => (
          <div
            key={`copy-${slide.key}`}
            className={`transition-all duration-700 ${
              index === active
                ? "relative translate-x-0 opacity-100 z-10"
                : "pointer-events-none absolute inset-x-4 translate-x-6 opacity-0 z-0"
            }`}
          >
            <p className="text-[11px] tracking-luxe text-gold-soft uppercase">
              {slide.label} · Season {year}
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.1] md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/80 md:text-base">
              {slide.copy}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={slide.href}
                className="rounded-full bg-white px-8 py-4 text-[11px] tracking-[0.24em] text-ink uppercase transition hover:bg-gold hover:text-white"
              >
                {slide.cta}
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-white/70 px-8 py-4 text-[11px] tracking-[0.24em] text-white uppercase transition hover:bg-white/10"
              >
                {slide.ctaSecondary}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        type="button"
        aria-label="Previous banner"
        onClick={() => go(active - 1)}
        className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-lg text-white backdrop-blur transition hover:bg-white hover:text-ink md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next banner"
        onClick={() => go(active + 1)}
        className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-lg text-white backdrop-blur transition hover:bg-white hover:text-ink md:flex"
      >
        ›
      </button>

      {/* slide meta + dots */}
      <div className="absolute bottom-6 left-0 z-10 w-full">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.key}`}
                type="button"
                aria-label={`Show ${slide.label} banner`}
                onClick={() => go(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? "w-10 bg-gold" : "w-4 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-cream/80 uppercase">
            <span>{slides[active]?.label}</span>
            <span className="text-cream/40">
              {active + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
