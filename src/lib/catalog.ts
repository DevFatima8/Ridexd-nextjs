export type GroupSlug = "women" | "men" | "kids" | "bed" | "bath" | "accessories";

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
  parentSlug?: string;
  name: string;
  tagline: string;
  image: string;
};

/**
  * Top level departments and curated category architecture.
 */
export const GROUPS: GroupMeta[] = [
  {
    slug: "women",
    name: "Women",
    tagline: "Stitched · Unstitched · Bottoms · 3 PC Sets · 1 PC · Separate Pieces",
    description:
      "Signature womenswear built on fine embroidery, breathable weaves and a silhouette for every occasion — from everyday stitched and unstitched suits to bottoms and separate pieces.",
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
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Bags · Jewellery · Scarves · Footwear · Belts & Eyewear",
    description:
      "Curated luxury and everyday accessories — handcrafted handbags, statement jewellery, silk scarves, leather footwear, belts and eyewear to elevate your style.",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    accent: "from-amber-100 to-amber-50",
  },
];

export const CATEGORIES: CategoryMeta[] = [
  // ---------- Women Main Categories ----------
  {
    group: "women",
    slug: "stitched",
    name: "Stitched",
    tagline: "Ready-to-wear 1 PC, 2 PC, 3 PC & Luxury suits",
    image:
      "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "unstitched",
    name: "Unstitched",
    tagline: "1 PC, 2 PC, 3 PC & Luxury unstitched fabric",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "bottoms",
    name: "Bottoms",
    tagline: "Trouser, Pants & Tights",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "3-pc-sets",
    name: "3 PC Sets",
    tagline: "Shirt, Dupatta & Trouser sets",
    image:
      "https://images.pexels.com/photos/29413562/pexels-photo-29413562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "1-pc",
    name: "1 PC",
    tagline: "Kurti & Kurti Sets",
    image:
      "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "separate-pieces",
    name: "Separate Pieces",
    tagline: "Kameez / Shirt & Shalwar / Trouser",
    image:
      "https://images.pexels.com/photos/29413658/pexels-photo-29413658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 1. Stitched ----------
  {
    group: "women",
    slug: "stitched-1-pc",
    parentSlug: "stitched",
    name: "1 PC",
    tagline: "Single stitched shirt / kurti",
    image:
      "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "stitched-2-pc",
    parentSlug: "stitched",
    name: "2 PC",
    tagline: "Stitched shirt with dupatta or trouser",
    image:
      "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "stitched-3-pc",
    parentSlug: "stitched",
    name: "3 PC",
    tagline: "Complete 3 piece stitched suit",
    image:
      "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "stitched-luxury",
    parentSlug: "stitched",
    name: "Luxury",
    tagline: "Luxury pret & couture stitched suit",
    image:
      "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 2. Unstitched ----------
  {
    group: "women",
    slug: "unstitched-1-pc",
    parentSlug: "unstitched",
    name: "1 PC",
    tagline: "Single unstitched shirt fabric",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "unstitched-2-pc",
    parentSlug: "unstitched",
    name: "2 PC",
    tagline: "Unstitched shirt & dupatta / trouser",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "unstitched-3-pc",
    parentSlug: "unstitched",
    name: "3 PC",
    tagline: "Full 3 piece unstitched suit fabric",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "unstitched-luxury",
    parentSlug: "unstitched",
    name: "Luxury",
    tagline: "Heavy embroidered luxury unstitched",
    image:
      "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 3. Bottoms ----------
  {
    group: "women",
    slug: "bottoms-trouser",
    parentSlug: "bottoms",
    name: "Trouser",
    tagline: "Stitched cotton & cambric trousers",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "bottoms-pants",
    parentSlug: "bottoms",
    name: "Pants",
    tagline: "Straight leg & cigarette pants",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "bottoms-tights",
    parentSlug: "bottoms",
    name: "Tights",
    tagline: "Stretch jersey & cotton tights",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 4. 3 PC Sets ----------
  {
    group: "women",
    slug: "3-pc-sets-shirt",
    parentSlug: "3-pc-sets",
    name: "Shirt",
    tagline: "3 PC matching embroidered shirt",
    image:
      "https://images.pexels.com/photos/29413562/pexels-photo-29413562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "3-pc-sets-dupatta",
    parentSlug: "3-pc-sets",
    name: "Dupatta",
    tagline: "3 PC designer dupatta",
    image:
      "https://images.pexels.com/photos/29413658/pexels-photo-29413658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "3-pc-sets-trouser",
    parentSlug: "3-pc-sets",
    name: "Trouser",
    tagline: "3 PC matching bottom / trouser",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 5. 1 PC ----------
  {
    group: "women",
    slug: "1-pc-kurti",
    parentSlug: "1-pc",
    name: "Kurti",
    tagline: "Single printed & embroidered kurti",
    image:
      "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "1-pc-kurti-sets",
    parentSlug: "1-pc",
    name: "Kurti Sets",
    tagline: "Kurti set with matching scarf",
    image:
      "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Women Subcategories: 6. Separate Pieces ----------
  {
    group: "women",
    slug: "separate-kameez-shirt",
    parentSlug: "separate-pieces",
    name: "Kameez / Shirt",
    tagline: "Separate stitched or unstitched shirt",
    image:
      "https://images.pexels.com/photos/29413658/pexels-photo-29413658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "women",
    slug: "separate-shalwar-trouser",
    parentSlug: "separate-pieces",
    name: "Shalwar / Trouser",
    tagline: "Separate tulip shalwar & trouser",
    image:
      "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
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

  // ---------- Accessories Main Categories ----------
  {
    group: "accessories",
    slug: "bags",
    name: "Bags & Clutches",
    tagline: "Handbags, Clutches & Wallets",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "jewelry",
    name: "Jewellery & Watches",
    tagline: "Earrings, Necklaces & Bangles",
    image:
      "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "scarves",
    name: "Scarves & Shawls",
    tagline: "Silk Scarves & Pashmina Shawls",
    image:
      "https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "footwear",
    name: "Footwear & Khussas",
    tagline: "Traditional Khussas & Sandals",
    image:
      "https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "belts",
    name: "Belts & Eyewear",
    tagline: "Leather Belts & Sunglasses",
    image:
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },

  // ---------- Accessories Subcategories ----------
  {
    group: "accessories",
    slug: "bags-handbags",
    parentSlug: "bags",
    name: "Handbags & Totes",
    tagline: "Everyday leather & canvas totes",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "bags-clutches",
    parentSlug: "bags",
    name: "Clutches & Evening Bags",
    tagline: "Embellished clutches & wristlets",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "jewelry-earrings",
    parentSlug: "jewelry",
    name: "Earrings & Rings",
    tagline: "Jhumkas, studs & statement rings",
    image:
      "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "jewelry-necklaces",
    parentSlug: "jewelry",
    name: "Necklaces & Sets",
    tagline: "Chokers, pendants & bridal sets",
    image:
      "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "scarves-dupattas",
    parentSlug: "scarves",
    name: "Silk Dupattas & Stoles",
    tagline: "Printed silk dupattas & stoles",
    image:
      "https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    group: "accessories",
    slug: "footwear-khussas",
    parentSlug: "footwear",
    name: "Embroidered Khussas",
    tagline: "Handcrafted leather khussas",
    image:
      "https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
];

export const GROUP_MAP: Record<string, GroupMeta> = Object.fromEntries(
  GROUPS.map((g) => [g.slug, g]),
);

export function categoriesForGroup(group: string, includeSubcategories = false): CategoryMeta[] {
  return CATEGORIES.filter(
    (c) => c.group === group && (includeSubcategories || !c.parentSlug),
  );
}

export function subcategoriesForCategory(group: string, parentSlug: string): CategoryMeta[] {
  return CATEGORIES.filter((c) => c.group === group && c.parentSlug === parentSlug);
}

export function categoryLabel(group: string, slug: string, subcategorySlug?: string): string {
  if (subcategorySlug) {
    const sub = CATEGORIES.find(
      (c) => c.group === group && (c.slug === subcategorySlug || c.slug === `${slug}-${subcategorySlug}`),
    );
    if (sub) return sub.name;
  }
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

export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@ridexd.com?_r=1&_t=ZS-9960OqoC8dr",
  facebook: "https://www.facebook.com/share/p/1B6qpsYiGC/",
  instagram: "https://www.instagram.com/stories/ridexd.com1/3969374579644731136_40781763528/",
};

