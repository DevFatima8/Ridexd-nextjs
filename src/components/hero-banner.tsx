"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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
 * Auto-advances every 4 seconds with smooth cross-fade + touch drag/swipe.
 */
export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  // Touch Swipe Handlers for Mobile Devices
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // minimum 40px swipe threshold
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next slide
      go(active + 1);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev slide
      go(active - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative isolate min-h-[500px] h-[75vh] max-h-[700px] sm:h-[580px] md:h-[640px] lg:h-[700px] w-full overflow-hidden bg-ink select-none"
    >
      {/* Background Images - Full Cover with Smooth Zoom */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            aria-hidden={index !== active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === active ? "z-0 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.label}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                index === active ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/20 md:via-ink/50 md:to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Container - Fixed grid stack to prevent CLS */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 pb-16 pt-8 text-cream">
        <div className="grid w-full grid-cols-1 grid-rows-1">
          {slides.map((slide, index) => (
            <div
              key={`copy-${slide.key}`}
              className={`col-start-1 row-start-1 transition-all duration-700 ease-out ${
                index === active
                  ? "z-10 translate-y-0 opacity-100 pointer-events-auto"
                  : "z-0 translate-y-4 opacity-0 pointer-events-none"
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-soft/30 bg-black/20 px-3 py-1 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-luxe text-gold-soft uppercase">
                  {slide.label} · Season {year}
                </p>
              </div>

              <h1 className="mt-4 max-w-2xl font-display text-2xl leading-[1.18] sm:text-4xl md:text-5xl lg:text-6xl text-cream font-normal drop-shadow-sm">
                {slide.title}
              </h1>

              <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-cream/90 font-light">
                {slide.copy}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                <Link
                  href={slide.href}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-ink uppercase transition-all duration-300 hover:bg-gold hover:text-white hover:scale-105 active:scale-95 shadow-md"
                >
                  {slide.cta}
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-black/10 px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white hover:scale-105 active:scale-95"
                >
                  {slide.ctaSecondary}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls (Desktop) */}
      <button
        type="button"
        aria-label="Previous banner"
        onClick={() => go(active - 1)}
        className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-xl text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-ink hover:scale-110 active:scale-95 md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next banner"
        onClick={() => go(active + 1)}
        className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-xl text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-ink hover:scale-110 active:scale-95 md:flex"
      >
        ›
      </button>

      {/* Navigation Dots & Active Counter */}
      <div className="absolute bottom-5 sm:bottom-6 left-0 z-20 w-full">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.key}`}
                type="button"
                aria-label={`Show ${slide.label} banner`}
                onClick={() => go(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === active ? "w-8 sm:w-10 bg-gold" : "w-3 sm:w-4 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] tracking-[0.24em] text-cream/90 uppercase backdrop-blur-md">
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

