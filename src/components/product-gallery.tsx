"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl bg-cream">
        <div className="aspect-[4/5]">
          {gallery[active] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={gallery[active]} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cream text-xs text-ink-soft/40">
              No image
            </div>
          )}
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
              {image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={image} alt={`${title} view ${index + 1}`} className="h-24 w-20 object-cover" />
              ) : (
                <div className="flex h-24 w-20 items-center justify-center bg-cream text-xs text-ink-soft/40">
                  No img
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
