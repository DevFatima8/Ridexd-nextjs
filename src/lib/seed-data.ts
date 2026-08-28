import type { GroupSlug } from "./catalog";

const W = [
  "https://images.pexels.com/photos/36325842/pexels-photo-36325842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413594/pexels-photo-29413594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/28390544/pexels-photo-28390544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/33210512/pexels-photo-33210512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413562/pexels-photo-29413562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413658/pexels-photo-29413658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413607/pexels-photo-29413607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413661/pexels-photo-29413661.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/29413650/pexels-photo-29413650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/38771059/pexels-photo-38771059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
];

const M = [
  "https://images.pexels.com/photos/28050797/pexels-photo-28050797.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/28332607/pexels-photo-28332607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/18059057/pexels-photo-18059057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/28050800/pexels-photo-28050800.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/12475959/pexels-photo-12475959.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/34423739/pexels-photo-34423739.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/13271410/pexels-photo-13271410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/16777497/pexels-photo-16777497.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/34423732/pexels-photo-34423732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/7905889/pexels-photo-7905889.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
];

const K = [
  "https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/8084066/pexels-photo-8084066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/33018404/pexels-photo-33018404.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/19664810/pexels-photo-19664810.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/8083844/pexels-photo-8083844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/8084232/pexels-photo-8084232.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
];

const H = [
  "https://images.pexels.com/photos/28513849/pexels-photo-28513849.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/4455836/pexels-photo-4455836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/18071807/pexels-photo-18071807.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/34574597/pexels-photo-34574597.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/34636330/pexels-photo-34636330.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7765000/pexels-photo-7765000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/20665616/pexels-photo-20665616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/34636328/pexels-photo-34636328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/9788329/pexels-photo-9788329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/31902663/pexels-photo-31902663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

type Draft = [
  title: string,
  subtitle: string,
  price: number,
  compareAt: number,
  fabric: string,
  color: string,
  a: number,
  b: number,
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL"];
const MEN_SIZES = ["S", "M", "L", "XL", "XXL"];
const KID_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
const BABY_SIZES = ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"];
const LINEN_SIZES = ["Single", "Queen", "King"];

export type SeedProduct = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  groupSlug: GroupSlug;
  categorySlug: string;
  subcategorySlug: string;
  price: number;
  compareAtPrice: number;
  cost: number;
  sku: string;
  stock: number;
  sizes: string[];
  images: string[];
  fabric: string;
  colorFamily: string;
  status: string;
  featured: boolean;
  vendor: string;
};

const SEED: Record<GroupSlug, Record<string, Draft[]>> = {
  women: {
    "stitched-1-pc": [
      ["Kurti Stitched Lawn Shirt", "1 PC stitched kurti", 2850, 3600, "Embroidered Lawn", "Rose Pink", 0, 1],
      ["Printed Daily Wear Kurti", "1 PC straight fit kurti", 2490, 3200, "Digital Lawn", "Mint Green", 1, 3],
    ],
    "stitched-2-pc": [
      ["Noor Chikankari 2 PC Suit", "Stitched shirt with straight trouser", 5290, 6900, "Chikankari Cotton", "Ivory", 1, 3],
      ["Zeenat Floral 2 PC Suit", "Stitched kameez with chiffon dupatta", 4890, 5990, "Digital Lawn", "Coral Pink", 3, 4],
    ],
    "stitched-3-pc": [
      ["Mehak Embroidered 3 PC Suit", "Complete 3 piece stitched suit", 6450, 8200, "Embroidered Lawn", "Sage Green", 0, 1],
      ["Sana Formal 3 PC Suit", "Sequin neckline stitched suit", 9750, 12500, "Net & Silk", "Deep Teal", 2, 5],
    ],
    "stitched-luxury": [
      ["Maharani Velvet Luxury Suit", "Hand embellished couture edit", 24500, 31000, "Velvet", "Emerald", 7, 2],
      ["Couture Net Luxury Suit", "Hand stone embroidery stitched", 15900, 19900, "Net", "Dusty Rose", 8, 2],
    ],
    "unstitched-1-pc": [
      ["Printed Lawn Shirt Piece", "1 PC unstitched 2.5m fabric", 1950, 2500, "Premium Lawn", "Sky Blue", 9, 1],
      ["Boski Unstitched Shirt Roll", "1 PC unstitched suiting", 2650, 3400, "Boski", "Charcoal", 9, 4],
    ],
    "unstitched-2-pc": [
      ["Lawn Shirt & Chiffon Dupatta", "2 PC unstitched fabric set", 3250, 4200, "Digital Lawn", "Peach", 9, 3],
      ["Khaddar Shirt & Trouser Roll", "2 PC winter unstitched", 3450, 4500, "Khaddar", "Maroon", 9, 6],
    ],
    "unstitched-3-pc": [
      ["Premium Lawn 3 PC Unstitched", "Kameez, dupatta & shalwar roll", 4250, 5500, "Premium Lawn", "Pastel Blue", 9, 1],
      ["Jacquard Khaddar 3 PC Roll", "Winter 3 piece fabric set", 3950, 4800, "Khaddar Jacquard", "Mustard", 9, 6],
    ],
    "unstitched-luxury": [
      ["Zardozi Organza Luxury Unstitched", "Heavy embroidered 3 piece", 18900, 24000, "Silk Organza", "Pearl White", 5, 7],
      ["Silk Chiffon Luxury Unstitched", "Dyeable couture 3 piece", 6750, 8500, "Chiffon Silk", "Champagne", 9, 8],
    ],
    "bottoms-trouser": [
      ["Cotton Straight Trouser", "Stitched everyday trouser", 1650, 2100, "Cotton Cambric", "Off White", 3, 1],
      ["Embroidered Tulip Trouser", "Scalloped hem trouser", 1990, 2600, "Slub Cotton", "Black", 6, 4],
    ],
    "bottoms-pants": [
      ["Cigarette Fit Pants", "Tailored ankle pants", 1850, 2400, "Cotton Twill", "Beige", 1, 6],
      ["Palazzo Flare Pants", "Relaxed wide leg pants", 1950, 2550, "Viscose Lawn", "Navy", 4, 3],
    ],
    "bottoms-tights": [
      ["Stretch Cotton Tights", "Soft elasticated tights", 990, 1400, "Jersey Cotton", "Black", 2, 0],
      ["Ankle Length Jersey Tights", "Everyday fit tights", 1150, 1550, "Stretch Jersey", "White", 0, 3],
    ],
    "3-pc-sets-shirt": [
      ["Embroidered Lawn Shirt", "3 PC matching shirt piece", 2950, 3800, "Embroidered Lawn", "Turquoise", 4, 3],
      ["Printed Lawn Long Kameez", "3 PC set shirt piece", 2750, 3500, "Digital Lawn", "Lilac", 7, 1],
    ],
    "3-pc-sets-dupatta": [
      ["Digital Chiffon Dupatta", "3 PC designer dupatta", 1850, 2400, "Chiffon", "Blush Pink", 7, 1],
      ["Pashmina Shawl Wrap", "3 PC winter dupatta shawl", 3290, 4200, "Pashmina Blend", "Walnut Brown", 5, 8],
    ],
    "3-pc-sets-trouser": [
      ["Cambric Dyed Trouser", "3 PC matching bottom", 1450, 1900, "Cambric Cotton", "Off White", 3, 1],
      ["Dyed Shalwar Piece", "3 PC stitched shalwar", 1550, 2000, "Cotton Lawn", "White", 2, 4],
    ],
    "1-pc-kurti": [
      ["Digital Print Lawn Kurti", "Single embroidered kurti", 2250, 2900, "Digital Lawn", "Yellow", 4, 0],
      ["Short Summer Kurti", "Casual daily kurti", 1950, 2600, "Cotton Cambric", "Sage", 0, 3],
    ],
    "1-pc-kurti-sets": [
      ["Embroidered Kurti & Scarf Set", "1 PC kurti with matching scarf", 3290, 4200, "Viscose Cotton", "Sand Beige", 1, 6],
      ["Aisha Printed Kurta Set", "1 PC tunic set", 3650, 4500, "Viscose Lawn", "Turquoise", 4, 3],
    ],
    "separate-kameez-shirt": [
      ["Classic Lawn Kameez", "Separate stitched shirt", 2450, 3100, "Lawn", "Pastel Green", 3, 1],
      ["Embroidered Organza Shirt", "Separate party shirt", 4590, 5800, "Organza", "Dusty Pink", 8, 2],
    ],
    "separate-shalwar-trouser": [
      ["Tulip Shalwar Separate", "Stitched separate tulip shalwar", 1750, 2300, "Cotton", "White", 2, 4],
      ["Patiala Shalwar Separate", "Pleated separate shalwar", 1890, 2450, "Cambric", "Black", 1, 6],
    ],
  },
  men: {
    stitched: [
      ["Classic White Kurta Shalwar", "Ready to wear set", 4290, 5400, "Cotton Wash & Wear", "White", 2, 0],
      ["Charcoal Slim Kurta Suit", "Straight fit 2 piece", 4990, 6200, "Wash & Wear", "Charcoal", 1, 2],
      ["Olive Everyday Kurta", "Mandarin collar", 3850, 4800, "Blended Cotton", "Olive", 3, 4],
      ["Executive Stitched Suit", "Kurta with trouser", 5890, 7400, "Premium Blend", "Navy", 9, 1],
    ],
    unstitched: [
      ["Boski Unstitched Suiting", "4 metre premium fabric", 6450, 8100, "Boski", "Ice Grey", 8, 5],
      ["Khaddar Winter Fabric", "3 piece winter roll", 3990, 4900, "Khaddar", "Steel Blue", 8, 6],
      ["Wash & Wear Fabric Roll", "Everyday 4 metre", 3450, 4300, "Wash & Wear", "Beige", 8, 3],
      ["Egyptian Cotton Suiting", "Luxury unstitched", 8950, 11200, "Egyptian Cotton", "Off White", 8, 9],
    ],
    elegant: [
      ["Elegant Waistcoat Kurta Set", "3 piece occasion wear", 9850, 12500, "Jamawar & Cotton", "Black", 6, 1],
      ["Midnight Sherwani Suit", "Embroidered neckline", 21500, 26500, "Raw Silk", "Midnight Blue", 6, 7],
      ["Ivory Reception Sherwani", "Hand embroidered", 28900, 36000, "Silk & Zardozi", "Ivory", 6, 8],
      ["Charcoal Prince Coat Suit", "Band gala with pants", 13500, 16800, "Wool Blend", "Charcoal", 1, 6],
    ],
    "kurta-shalwar": [
      ["Everyday Kurta Shalwar", "Comfort straight fit", 3290, 4100, "Cotton Blend", "White", 2, 4],
      ["Festive Green Kurta", "Eid ready edit", 4150, 5200, "Wash & Wear", "Bottle Green", 0, 3],
      ["Denim Look Kurta Suit", "Street eastern fusion", 4650, 5800, "Denim Cotton", "Indigo", 4, 0],
      ["Grandad Collar Kurta", "Minimal daily wear", 3490, 4400, "Slub Cotton", "Stone", 5, 2],
    ],
    waistcoats: [
      ["Jamawar Wedding Waistcoat", "Structured occasion layer", 6450, 8200, "Jamawar", "Maroon", 6, 5],
      ["Embroidered Black Waistcoat", "Satin finish", 5490, 6900, "Satin Blend", "Black", 1, 6],
      ["Ivory Sherwani Waistcoat", "Beaded front panel", 9250, 11800, "Net & Silk", "Ivory", 7, 6],
      ["Everyday Cotton Waistcoat", "Lightweight layer", 3890, 4900, "Cotton", "Grey Melange", 9, 6],
    ],
  },
  kids: {
    boys: [
      ["Adventure Denim Set", "Shirt + jogger set", 2650, 3400, "Denim Cotton", "Indigo", 0, 2],
      ["Boys Formal Suit Set", "Blazer with bow tie", 4290, 5400, "Suiting Fabric", "Black", 2, 1],
      ["Graphic Tee & Shorts Set", "Summer comfort pack", 1950, 2500, "Cotton Jersey", "Sky Blue", 0, 4],
      ["Cargo Pants & Top Set", "Play ready outfit", 2290, 2900, "Twill Cotton", "Olive", 4, 0],
    ],
    girls: [
      ["Blossom Printed Frock", "Layered party frock", 2890, 3700, "Cotton Lawn", "Pink", 3, 6],
      ["Girls Summer 2 Piece Set", "Top with leggings", 2150, 2800, "Cotton Jersey", "Lemon", 6, 3],
      ["Denim Dungaree Dress", "Adjustable straps", 2650, 3300, "Denim", "Light Blue", 7, 3],
      ["Sequin Party Frock", "Birthday edit", 3990, 5100, "Net & Satin", "Lavender", 6, 7],
    ],
    baby: [
      ["Baby Essentials 5 Pack", "Onesie bundle", 2450, 3200, "Organic Cotton", "Mixed", 4, 0],
      ["Soft Romper Set", "Snap button romper", 1650, 2100, "Hosiery Cotton", "Mint", 4, 1],
      ["Baby Winter Sleepsuit", "Fleece lined", 2190, 2800, "Fleece", "Cream", 4, 6],
      ["Newborn Gift Box", "7 piece gift set", 3450, 4400, "Cotton Blend", "Pastel", 4, 3],
    ],
    "eastern-sets": [
      ["Boys Kurta Shalwar Set", "Festive eastern set", 2450, 3100, "Wash & Wear", "White", 5, 1],
      ["Girls Eid Frock Set", "Embroidered 2 piece", 2990, 3800, "Lawn & Silk", "Peach", 1, 6],
      ["Sibling Match Set", "Brother & sister combo", 4650, 5900, "Cotton Blend", "Cream", 1, 5],
      ["Boys Waistcoat Kurta", "3 piece eastern set", 3490, 4400, "Jamawar", "Navy", 2, 5],
    ],
    "sleepwear-school": [
      ["Cosy Night Suit", "Full sleeve pyjama set", 1850, 2400, "Cotton Jersey", "Navy Print", 7, 4],
      ["School Uniform 2 Piece", "Shirt with trouser", 1990, 2550, "Poly Viscose", "Sky", 0, 2],
      ["School Uniform 3 Piece", "Shirt, pant & tie", 2450, 3100, "Poly Viscose", "Grey", 2, 0],
      ["Thermal Pyjama Set", "Winter sleepwear", 2150, 2750, "Thermal Knit", "Charcoal", 4, 7],
    ],
  },
  bed: {
    "bed-sheets": [
      ["Hotel Percale Bed Sheet Set", "200 TC, fitted + 2 cases", 5450, 6900, "Cotton Percale", "White", 0, 9],
      ["Sateen Luxe Sheet Set", "400 TC silky weave", 7950, 9900, "Cotton Sateen", "Champagne", 0, 3],
      ["Blue Check Sheet Set", "King size 4 piece", 4850, 6200, "Cotton Blend", "Blue Check", 5, 0],
      ["Jacquard Sheet Set", "Woven motif design", 6750, 8400, "Jacquard", "Ivory", 9, 0],
    ],
    "quilts-comforters": [
      ["Featherlight Comforter", "All season quilt", 8950, 11500, "Micro Fibre", "Dove Grey", 8, 7],
      ["Winter Down Quilt", "Heavy warmth Tog 13", 12900, 16000, "Down Alternative", "White", 8, 0],
      ["Quilted Bed Cover Set", "Quilt with 2 cushions", 7450, 9200, "Quilted Cotton", "Teal", 3, 8],
      ["Summer Blanket Quilt", "Light breathable fill", 4950, 6300, "Cotton Fill", "Sand", 9, 8],
    ],
    "duvet-covers": [
      ["Sateen Duvet Cover Set", "Queen with cases", 6450, 8100, "Cotton Sateen", "Pearl White", 9, 0],
      ["Printed Duvet Cover Set", "King size 3 piece", 5850, 7400, "Micro Suede", "Botanical", 5, 9],
      ["Washed Linen Duvet Set", "Stonewashed finish", 8950, 11200, "French Linen", "Oatmeal", 0, 9],
      ["Quilted Duvet Cover", "Reversible design", 7250, 9000, "Quilted Blend", "Slate", 7, 3],
    ],
    "pillows-cushions": [
      ["Memory Foam Pillow Pair", "Contour support", 4450, 5600, "Memory Foam", "White", 8, 9],
      ["Micro Fibre Pillow Pair", "Plush hotel feel", 2950, 3800, "Micro Fibre", "White", 9, 8],
      ["Decor Cushion Set of 4", "Covers with fillers", 3450, 4400, "Velvet & Linen", "Mixed", 3, 7],
      ["Bolster Neck Pillow", "Cervical support", 1890, 2400, "Fibre Fill", "Grey", 8, 3],
    ],
    "mattress-protectors": [
      ["Waterproof Mattress Protector", "Terry top, queen", 3290, 4200, "Terry TPU", "White", 3, 0],
      ["Zippered Mattress Encasement", "Full 6 side cover", 4290, 5400, "Poly Knit", "White", 0, 3],
      ["Cooling Gel Protector", "Breathable king size", 4950, 6200, "Gel Knit", "Silver", 7, 3],
      ["Quilted Mattress Topper", "Extra plush comfort", 5750, 7200, "Quilted Fibre", "Ivory", 9, 8],
    ],
  },
  bath: {
    towels: [
      ["Zero Twist Bath Towel Set", "2 bath + 2 hand", 4290, 5400, "Zero Twist Cotton", "White", 6, 1],
      ["Premium Combed Towel Pack", "600 GSM 4 piece", 5450, 6900, "Combed Cotton", "Slate Blue", 6, 2],
      ["Waffle Guest Towel Set", "6 piece quick dry", 2950, 3700, "Waffle Weave", "Beige", 1, 6],
      ["Hooded Baby Towel", "Soft cotton with hood", 1450, 1900, "Cotton Terry", "Mint", 2, 6],
    ],
    bathrobes: [
      ["Waffle Spa Bathrobe", "Unisex knee length", 5450, 6900, "Waffle Cotton", "White", 2, 1],
      ["Terry Cotton Bathrobe", "Shawl collar, king size", 6290, 7900, "Terry Cotton", "Pearl Grey", 1, 2],
      ["Kids Hooded Bathrobe", "Absorbent & cosy", 2750, 3500, "Cotton Terry", "Sky", 4, 6],
      ["Kimono Silk Robe", "Bridal luxury robe", 7950, 9900, "Silk Blend", "Blush", 4, 1],
    ],
    "bath-mats": [
      ["Anti-Slip Bath Mat", "Memory foam 50x80", 2350, 3000, "Memory Foam", "Charcoal", 4, 2],
      ["Diatomite Stone Mat", "Instant dry, 60x40", 3450, 4400, "Diatomite", "Stone Grey", 3, 4],
      ["Cotton Bath Mat Set of 2", "Tufted soft pile", 1950, 2500, "Cotton Tuft", "Ivory", 1, 4],
      ["Contour Toilet Mat Set", "3 piece matching set", 2150, 2750, "Micro Fibre", "Aqua", 2, 4],
    ],
    "shower-curtains": [
      ["PEVA Shower Curtain", "Waterproof 180x200", 1890, 2400, "PEVA", "Clear", 3, 4],
      ["Fabric Shower Curtain", "Linen look with hooks", 2650, 3400, "Poly Linen", "Natural", 0, 3],
      ["Printed Curtain with Liner", "Boho design set", 2950, 3700, "Polyester", "Terracotta", 5, 3],
      ["Waffle Weave Curtain", "Hotel spa style", 3290, 4100, "Waffle Polyester", "White", 2, 3],
    ],
    "bath-sets": [
      ["Bath Gift Set Deluxe", "Towels, robe & mat", 9450, 11900, "Cotton Mix", "White", 1, 6],
      ["Ceramic 5 Piece Bath Set", "Dispenser, bin & tray", 4650, 5800, "Ceramic", "Matte Black", 3, 4],
      ["Bamboo Organiser Set", "Shelf & 3 baskets", 3950, 4900, "Bamboo", "Natural", 4, 3],
      ["Bath Accessory Set of 6", "Complete bath kit", 3450, 4400, "PP & Bamboo", "Grey", 2, 4],
    ],
  },
};

const SIZES_BY_GROUP: Record<GroupSlug, string[]> = {
  women: CLOTHING_SIZES,
  men: MEN_SIZES,
  kids: KID_SIZES,
  bed: LINEN_SIZES,
  bath: LINEN_SIZES,
};

const IMG: Record<GroupSlug, string[]> = { women: W, men: M, kids: K, bed: H, bath: H };
const BABY_CATEGORIES = ["baby"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SEED_PRODUCTS: SeedProduct[] = (() => {
  const out: SeedProduct[] = [];
  let index = 0;
  (Object.keys(SEED) as GroupSlug[]).forEach((group) => {
    Object.entries(SEED[group]).forEach(([key, drafts]) => {
      drafts.forEach((draft, i) => {
        const [title, subtitle, price, compareAt, fabric, color, a, b] = draft;
        index += 1;

        let categorySlug = key;
        let subcategorySlug = "";

        if (group === "women" && key.includes("-")) {
          const parts = key.split("-");
          if (["stitched", "unstitched", "bottoms", "3-pc-sets", "1-pc", "separate-pieces"].includes(parts[0])) {
            categorySlug = parts[0];
            subcategorySlug = key;
          } else if (key.startsWith("3-pc-sets-") || key.startsWith("1-pc-")) {
            if (key.startsWith("3-pc-sets-")) {
              categorySlug = "3-pc-sets";
              subcategorySlug = key;
            } else {
              categorySlug = "1-pc";
              subcategorySlug = key;
            }
          }
        }

        const sizes = BABY_CATEGORIES.includes(categorySlug)
          ? BABY_SIZES
          : SIZES_BY_GROUP[group];

        out.push({
          slug: `${slugify(title)}-${group === "bed" || group === "bath" ? "hm" : group}-${1000 + index}`,
          title,
          subtitle,
          description: `${title} — ${subtitle.toLowerCase()}. Crafted from ${fabric.toLowerCase()} in a ${color.toLowerCase()} finish, this Ridexd ${
            group === "women"
              ? "suit piece"
              : categorySlug.replace(/-/g, " ")
          } is quality checked in our Lahore studio and shipped ready to use. Care: machine wash cold with like colours, do not bleach, warm iron on reverse. Free delivery on orders above Rs 5,000 and 14 day easy exchange on all full price items.`,
          groupSlug: group,
          categorySlug,
          subcategorySlug,
          price,
          compareAtPrice: compareAt,
          cost: Math.round(price * 0.55),
          sku: `RDX-${group.slice(0, 2).toUpperCase()}-${String(1000 + index)}`,
          stock: 8 + ((index * 7) % 60),
          sizes,
          images: [IMG[group][a % IMG[group].length], IMG[group][b % IMG[group].length]],
          fabric,
          colorFamily: color,
          status: "active",
          featured: i === 0 || index % 9 === 0,
          vendor: "Ridexd Studio",
        });
      });
    });
  });
  return out;
})();
