import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getCategoryOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const categories = await getCategoryOverview();

  return (
    <CartProvider>
      <SiteHeader categories={categories} />
      <CartDrawer />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter categories={categories} />
      <WhatsAppButton />
    </CartProvider>
  );
}
