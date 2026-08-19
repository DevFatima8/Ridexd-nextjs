import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ridexd.com — Women, Men, Kids, Bed & Bath Online Store",
    template: "%s | Ridexd.com",
  },
  description:
    "Shop Ridexd.com for women stitched, unstitched & luxury pret, men stitched, unstitched & elegant tailoring, kids wear, plus premium bed and bath textiles. Cash on delivery across Pakistan.",
  keywords: [
    "Ridexd",
    "online shopping Pakistan",
    "stitched suits",
    "unstitched fabric",
    "luxury pret",
    "men kurta",
    "kids clothing",
    "bed sheets",
    "towels",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
