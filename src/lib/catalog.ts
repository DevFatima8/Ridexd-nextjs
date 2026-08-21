export type GroupSlug = "women" | "men" | "kids" | "bed" | "bath";

export type GroupMeta = {
  slug: GroupSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
};

export type CategoryMeta = {
  group: GroupSlug;
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

/**
 * 5 top level departments, each with exactly 5 categories.
 */
export const GROUPS: GroupMeta[] = [
  {
    slug: "women",
    name: "Women",
    tagline: "Stitched · Unstitched · Luxury",
    description:
      "Signature womenswear built on fine embroidery, breathable weaves and a silhouette for every occasion — from everyday stitched suits to couture-grade luxury pret.",
    image:
      "https://images.pexels.com/photos/36325842/pexels-photo-36325842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    accent: "from-rose-100 to-amber-50",
  },
  {
    slug: "men",
    name: "Men",
    tagline: "Stitched · Unstitched · Elegant",
    description:
      "Sharp tailoring and relaxed eastern staples. Curated stitched kurtas, premium unstitched suiting and an elegant line for weddings and evenings.",
    image:
      "https://images.pexels.com/photos/28332607/pexels-photo-28332607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    accent: "from-slate-200 to-zinc-100",
  },
  {
    slug: "kids",
    name: "Kids",
    tagline: "Boys · Girls · Baby",
    description:
      "Playful, durable and skin-friendly outfits for boys, girls, toddlers and newborns — plus school-ready sets and cosy sleepwear.",
    image:
      "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    accent: "from-sky-100 to-emerald-50",
  },
  {
    slug: "bed",
    name: "Bed",
    tagline: "Sheets · Quilts · Pillows",
    description:
      "Hotel-grade bed linen woven for Pakistani summers and winters — percale sheets, plush quilts, duvet covers, pillows and mattress protectors.",
    image:
      "https://images.pexels.com/photos/7765000/pexels-photo-7765000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    accent: "from-indigo-100 to-slate-50",
  },
  {
    slug: "bath",
    name: "Bath",
    tagline: "Towels · Robes · Mats",
    description:
      "Zero-twist cotton towels, waffle robes, anti-slip bath mats and complete bath sets that turn a daily routine into a spa ritual.",
    image:
      "https://images.pexels.com/photos/20665616/pexels-photo-20665616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    accent: "from-cyan-100 to-teal-50",
  },
];

export const CATEGORIES: CategoryMeta[] = [
  // ---------- Women ----------
  {
    group: "women",
    slug: "stitched",
    name: "Stitched",
    tagline: "Ready-to-wear 2 & 3 piece suits",
    image:
      "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "unstitched",
    name: "Unstitched Shalwar Kameez",
    tagline: "3 piece shalwar kameez fabric rolls",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "luxury-pret",
    name: "Luxury Pret",
    tagline: "Hand-embellished couture edits",
    image:
      "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "kurta-sets",
    name: "Kurta Sets",
    tagline: "Everyday kurtas with palazzo & pants",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "shawls-dupattas",
    name: "Shawls & Dupattas",
    tagline: "Pashmina, jacquard & chiffon",
    image:
      "https://images.pexels.com/photos/29413658/pexels-photo-29413658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Men ----------
  {
    group: "men",
    slug: "stitched",
    name: "Stitched",
    tagline: "Ready-made kurtas & shalwar suits",
    image:
      "https://images.pexels.com/photos/18059057/pexels-photo-18059057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "men",
    slug: "unstitched",
    name: "Unstitched",
    tagline: "Wash & wear, boski & khaddar fabric",
    image:
      "https://images.pexels.com/photos/34423732/pexels-photo-34423732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "men",
    slug: "elegant",
    name: "Elegant",
    tagline: "Wedding & evening tailoring",
    image:
      "https://images.pexels.com/photos/13271410/pexels-photo-13271410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "men",
    slug: "kurta-shalwar",
    name: "Kurta & Shalwar",
    tagline: "Classic everyday eastern wear",
    image:
      "https://images.pexels.com/photos/28050797/pexels-photo-28050797.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "men",
    slug: "waistcoats",
    name: "Waistcoats & Sherwani",
    tagline: "Structured layers for big days",
    image:
      "https://images.pexels.com/photos/34423739/pexels-photo-34423739.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Kids ----------
  {
    group: "kids",
    slug: "boys",
    name: "Boys",
    tagline: "Ages 2–14 years",
    image:
      "https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "kids",
    slug: "girls",
    name: "Girls",
    tagline: "Ages 2–14 years",
    image:
      "https://images.pexels.com/photos/8084066/pexels-photo-8084066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "kids",
    slug: "baby",
    name: "Baby",
    tagline: "0–24 months essentials",
    image:
      "https://images.pexels.com/photos/33018404/pexels-photo-33018404.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "kids",
    slug: "eastern-sets",
    name: "Eastern Sets",
    tagline: "Festive kurta & frock sets",
    image:
      "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "kids",
    slug: "sleepwear-school",
    name: "Sleepwear & School",
    tagline: "Night suits & uniform sets",
    image:
      "https://images.pexels.com/photos/8084232/pexels-photo-8084232.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Bed ----------
  {
    group: "bed",
    slug: "bed-sheets",
    name: "Bed Sheets",
    tagline: "Percale, sateen & jacquard",
    image:
      "https://images.pexels.com/photos/28513849/pexels-photo-28513849.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bed",
    slug: "quilts-comforters",
    name: "Quilts & Comforters",
    tagline: "Winter warmth, featherlight fill",
    image:
      "https://images.pexels.com/photos/9788329/pexels-photo-9788329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bed",
    slug: "duvet-covers",
    name: "Duvet Covers",
    tagline: "King, queen & single sizes",
    image:
      "https://images.pexels.com/photos/31902663/pexels-photo-31902663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bed",
    slug: "pillows-cushions",
    name: "Pillows & Cushions",
    tagline: "Memory foam & micro fibre",
    image:
      "https://images.pexels.com/photos/34636328/pexels-photo-34636328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bed",
    slug: "mattress-protectors",
    name: "Mattress Protectors",
    tagline: "Waterproof & breathable",
    image:
      "https://images.pexels.com/photos/34574597/pexels-photo-34574597.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },

  // ---------- Bath ----------
  {
    group: "bath",
    slug: "towels",
    name: "Towels",
    tagline: "Zero-twist & combed cotton",
    image:
      "https://images.pexels.com/photos/20665616/pexels-photo-20665616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bath",
    slug: "bathrobes",
    name: "Bathrobes",
    tagline: "Waffle & terry spa robes",
    image:
      "https://images.pexels.com/photos/4455836/pexels-photo-4455836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bath",
    slug: "bath-mats",
    name: "Bath Mats",
    tagline: "Anti-slip, quick dry",
    image:
      "https://images.pexels.com/photos/18071807/pexels-photo-18071807.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bath",
    slug: "shower-curtains",
    name: "Shower Curtains",
    tagline: "Mould-resistant PE & linen",
    image:
      "https://images.pexels.com/photos/34574597/pexels-photo-34574597.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    group: "bath",
    slug: "bath-sets",
    name: "Bath Sets & Accessories",
    tagline: "Bundles, bins & dispensers",
    image:
      "https://images.pexels.com/photos/34636330/pexels-photo-34636330.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];

export const GROUP_MAP: Record<string, GroupMeta> = Object.fromEntries(
  GROUPS.map((g) => [g.slug, g]),
);

export function categoriesForGroup(group: string): CategoryMeta[] {
  return CATEGORIES.filter((c) => c.group === group);
}

export function categoryLabel(group: string, slug: string): string {
  const cat = CATEGORIES.find((c) => c.group === group && c.slug === slug);
  return cat ? cat.name : slug;
}

export function formatPKR(value: number): string {
  return `PKR ${new Intl.NumberFormat("en-PK").format(Math.round(value))}`;
}

export const SHIPPING_FLAT = 250;
export const FREE_SHIPPING_THRESHOLD = 5000;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

export const MAX_PRODUCT_IMAGES = 20;
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923000000000";
