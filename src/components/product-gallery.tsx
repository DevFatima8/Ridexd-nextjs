"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const gallery = images.length ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl bg-cream">
        <div className="aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[active]} alt={title} className="h-full w-full object-cover" />
        </div>
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-lg border transition ${
                active === index ? "border-ink" : "border-sand hover:border-gold"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`${title} view ${index + 1}`} className="h-24 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
