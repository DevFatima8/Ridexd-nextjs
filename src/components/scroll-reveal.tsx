"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number; // Delay in ms
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const animationClass =
    animation === "slide-left"
      ? "animate-slide-left"
      : animation === "slide-right"
      ? "animate-slide-right"
      : animation === "fade-up"
      ? "animate-fade-up"
      : animation === "scale-in"
      ? "animate-scale-in"
      : "animate-fade-in";

  const initialTransformClass =
    animation === "slide-left"
      ? "-translate-x-8"
      : animation === "slide-right"
      ? "translate-x-8"
      : animation === "scale-in"
      ? "scale-[0.96]"
      : animation === "fade-up"
      ? "translate-y-6"
      : "";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? `${animationClass} opacity-100 translate-x-0 translate-y-0 scale-100`
          : `opacity-0 ${initialTransformClass} pointer-events-none`
      } ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

