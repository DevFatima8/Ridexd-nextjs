"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (rating: number) => void;
  showScore?: boolean;
  count?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  readOnly = true,
  size = "md",
  onChange,
  showScore = false,
  count,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const currentDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" role={readOnly ? "img" : "radiogroup"} aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = currentDisplay >= starValue;
          const isHalf = !readOnly && false; // decimal handling for readOnly below

          // For readOnly, handle fractional stars visually if rating is between stars
          const fillPercentage = readOnly
            ? Math.max(0, Math.min(100, (rating - index) * 100))
            : isFilled
            ? 100
            : 0;

          return (
            <button
              key={index}
              type="button"
              disabled={readOnly}
              aria-label={`${starValue} Star${starValue > 1 ? "s" : ""}`}
              onClick={() => !readOnly && onChange?.(starValue)}
              onMouseEnter={() => !readOnly && setHoverRating(starValue)}
              onMouseLeave={() => !readOnly && setHoverRating(null)}
              className={`relative inline-block transition-transform focus:outline-none ${
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
              }`}
            >
              {/* Background empty star */}
              <svg
                className={`${starSizes[size]} text-sand-dark stroke-sand-dark text-gray-200 fill-gray-200`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.41.87-.833.618l-4.706-2.822a.563.563 0 00-.58 0l-4.706 2.822c-.424.252-.949-.13-.833-.618l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>

              {/* Filled star overlay based on percentage */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <svg
                    className={`${starSizes[size]} text-amber-500 fill-amber-400`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.41.87-.833.618l-4.706-2.822a.563.563 0 00-.58 0l-4.706 2.822c-.424.252-.949-.13-.833-.618l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-ink">
          {rating.toFixed(1)}
        </span>
      )}

      {typeof count === "number" && (
        <span className="text-xs text-ink-soft/60">
          ({count})
        </span>
      )}
    </div>
  );
}
