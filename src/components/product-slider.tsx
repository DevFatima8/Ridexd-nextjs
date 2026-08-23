"use client";

import { useEffect, useState } from "react";
import type { ProductRow } from "@/db/schema";
import { ProductCard } from "./product-card";

/**
 * Auto-playing product carousel — newest product first, slides left→right
 * every 3 seconds, loops back to the start and also supports manual controls.
 */
export function ProductSlider({ products }: { products: ProductRow[] }) {
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    function onResize() {
      const width = window.innerWidth;
      setPerView(width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4);
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
    }, 3000);
    return () => clearInterval(timer);
  }, [paused, maxIndex]);

  if (products.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${(currentIndex * 100) / perView}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 px-2.5"
              style={{ width: `${100 / perView}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous products"
        onClick={() => setIndex((current) => (current === 0 ? maxIndex : current - 1))}
        className="absolute -left-3 top-[34%] hidden h-11 w-11 items-center justify-center rounded-full border border-sand bg-white text-lg shadow-md transition hover:bg-ink hover:text-white md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => setIndex((current) => (current >= maxIndex ? 0 : current + 1))}
        className="absolute -right-3 top-[34%] hidden h-11 w-11 items-center justify-center rounded-full border border-sand bg-white text-lg shadow-md transition hover:bg-ink hover:text-white md:flex"
      >
        ›
      </button>

      <div className="mt-7 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => i).map((dot) => (
          <button
            key={dot}
            type="button"
            aria-label={`Go to slide ${dot + 1}`}
            onClick={() => setIndex(dot)}
            className={`h-1.5 rounded-full transition-all ${
              dot === currentIndex ? "w-7 bg-ink" : "w-1.5 bg-sand hover:bg-gold"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
