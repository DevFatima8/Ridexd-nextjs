export type StockStatus = "In Stock" | "Limited Stock" | "Out of Stock";

export const LIMITED_STOCK_THRESHOLD = 10;

/**
 * Calculates stock status centrally based on stock quantity:
 * - quantity > 10 => "In Stock"
 * - quantity >= 1 && quantity <= 10 => "Limited Stock"
 * - quantity === 0 => "Out of Stock"
 */
export function getStockStatus(stock: number): StockStatus {
  const qty = Math.max(0, Math.floor(Number(stock) || 0));
  if (qty <= 0) return "Out of Stock";
  if (qty <= LIMITED_STOCK_THRESHOLD) return "Limited Stock";
  return "In Stock";
}

/**
 * Returns badge styling and labels for Admin UI
 */
export function getAdminStockBadge(stock: number) {
  const status = getStockStatus(stock);
  switch (status) {
    case "Out of Stock":
      return {
        status,
        badgeClass: "bg-[#fdf1ef] text-[#d72c0d] border border-[#f8b4ab]",
        textClass: "text-[#d72c0d] font-semibold",
      };
    case "Limited Stock":
      return {
        status,
        badgeClass: "bg-[#fff8e5] text-[#b76e00] border border-[#ffe299]",
        textClass: "text-[#b76e00] font-semibold",
      };
    case "In Stock":
    default:
      return {
        status,
        badgeClass: "bg-[#e3f4e6] text-[#107f5a] border border-[#a3e0b2]",
        textClass: "text-[#107f5a] font-medium",
      };
  }
}

/**
 * Returns badge styling and display text for Storefront UI
 */
export function getStoreStockInfo(stock: number) {
  const qty = Math.max(0, Math.floor(Number(stock) || 0));
  const status = getStockStatus(qty);

  if (status === "Out of Stock") {
    return {
      status,
      badgeText: "Out of Stock",
      detailText: "Out of Stock",
      badgeClass: "bg-plum text-white",
      isAvailable: false,
    };
  }

  if (status === "Limited Stock") {
    return {
      status,
      badgeText: "Limited Stock",
      detailText: "Limited Stock",
      badgeClass: "bg-gold text-white",
      isAvailable: true,
    };
  }

  return {
    status,
    badgeText: "In Stock",
    detailText: "In Stock",
    badgeClass: "bg-emerald-700 text-white",
    isAvailable: true,
  };
}
