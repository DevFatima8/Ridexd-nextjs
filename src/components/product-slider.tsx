"use client";

import { useEffect, useState, useRef } from "react";
import type { ProductRow } from "@/db/schema";
import { ProductCard } from "./product-card";

/**
 * Auto-playing product carousel — newest product first, slides left→right
 * with touch drag/swipe support and responsive breakpoints.
 */
export function ProductSlider({ products }: { products: ProductRow[] }) {
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    function onResize() {
      const width = window.innerWidth;
      setPerView(width < 768 ? 2 : width < 1100 ? 3 : 4);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, products.length - perView);
  const currentIndex = Math.min(index, maxIndex);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, maxIndex]);

  // Touch Swipe Handlers
  function handleTouchStart(e: React.TouchEvent) {
    setPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    setPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 35;
    if (distance > minSwipeDistance) {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    } else if (distance < -minSwipeDistance) {
      setIndex((current) => (current === 0 ? maxIndex : current - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  if (products.length === 0) return null;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${(currentIndex * 100) / perView}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 px-2 sm:px-2.5"
              style={{ width: `${100 / perView}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrow Buttons */}
      <button
        type="button"
        aria-label="Previous products"
        onClick={() => setIndex((current) => (current === 0 ? maxIndex : current - 1))}
        className="absolute -left-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-sand bg-white/95 text-xl shadow-lg backdrop-blur transition-all duration-300 hover:bg-ink hover:text-white hover:scale-110 active:scale-95 md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => setIndex((current) => (current >= maxIndex ? 0 : current + 1))}
        className="absolute -right-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-sand bg-white/95 text-xl shadow-lg backdrop-blur transition-all duration-300 hover:bg-ink hover:text-white hover:scale-110 active:scale-95 md:flex"
      >
        ›
      </button>

      {/* Pagination Indicator Dots */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => i).map((dot) => (
          <button
            key={dot}
            type="button"
            aria-label={`Go to slide ${dot + 1}`}
            onClick={() => setIndex(dot)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              dot === currentIndex ? "w-8 bg-ink" : "w-2 bg-sand hover:bg-gold"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

