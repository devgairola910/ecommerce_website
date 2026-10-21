// VØID // ATELIER - Product Catalog Dataset

const PRODUCTS = [
  {
    id: "prod-01",
    name: "Heavyweight Boxy Hoodie",
    category: "hoodies",
    categoryLabel: "Hoodies & Sweats",
    price: 185,
    comparePrice: 220,
    badge: "Limited Run",
    rating: 4.9,
    reviewsCount: 48,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Vintage Charcoal", hex: "#2b2d2f" },
      { name: "Bone White", hex: "#e5e3df" }
    ],
    image: "assets/images/hoodie-charcoal.jpg",
    description: "Constructed from 480GSM organic French terry cotton. Features an architectural drop-shoulder cut, double-layered hood without drawstrings, and subtle tonal embroidery on the chest.",
    details: [
      "100% GOTS Certified Organic Cotton (480GSM)",
      "Pigment dyed and enzyme washed for vintage handfeel",
      "Reinforced ribbed cuffs and waistband",
      "Crafted in Portugal"
    ],
    fit: "Boxy, relaxed silhouette. We recommend taking your standard size for an oversized look.",
    inStock: true,
    stockCount: 6,
    isNew: true,
    featured: true,
    hotspot: { x: 19, y: 46, label: "Heavyweight Boxy Hoodie ($185)" }
  },
  {
    id: "prod-02",
    name: "Tactical Modular Cargo Pant",
    category: "bottoms",
    categoryLabel: "Pants & Bottoms",
    price: 240,
    comparePrice: null,
    badge: "Core Essential",
    rating: 5.0,
    reviewsCount: 62,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Matte Black", hex: "#111213" },
      { name: "Olive Drab", hex: "#3b4237" }
    ],
    image: "assets/images/cargo-black.jpg",
    description: "Engineered high-density ripstop cargo trousers with 8 utility compartments, magnetic Fidlock attachments, and adjustable cinch cuffs for versatile styling.",
    details: [
      "CORDURA® 500D Ballistic Ripstop blend",
      "Water-repellent DWR coating",
      "German magnetic pocket clasps",
      "Articulated knees for ergonomic mobility"
    ],
    fit: "Relaxed straight taper with adjustable ankle cords to alter drape over boots or sneakers.",
    inStock: true,
    stockCount: 12,
    isNew: false,
    featured: true,
    hotspot: { x: 22, y: 72, label: "Tactical Modular Cargo ($240)" }
  },
  {
    id: "prod-03",
    name: "Technical Weatherproof Bomber",
    category: "outerwear",
    categoryLabel: "Outerwear",
    price: 360,
    comparePrice: 420,
    badge: "Gore-Tex",
    rating: 4.8,
    reviewsCount: 31,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Dark Olive & Noir", hex: "#3a4439" },
      { name: "Stealth Black", hex: "#151617" }
    ],
    image: "assets/images/bomber-olive.jpg",
    description: "Dual-tone technical bomber engineered with waterproof 3-layer membrane fabric, taped thermal YKK zippers, and interior carry harness straps for temperature adaptation.",
    details: [
      "3-Layer breathable weatherproof laminate",
      "Taped seam construction with 20,000mm hydrostatic rating",
      "Interior sling strap for hands-free shoulder carry",
      "Two-way heavy duty YKK Aquaguard® zippers"
    ],
    fit: "Structured boxy bomber cut with dropped armholes for easy layering over heavyweight hoodies.",
    inStock: true,
    stockCount: 4,
    isNew: true,
    featured: true,
    hotspot: { x: 37, y: 44, label: "Weatherproof Bomber ($360)" }
  },
  {
    id: "prod-04",
    name: "Neo-Shift Sculptural Runner",
    category: "footwear",
    categoryLabel: "Footwear",
    price: 295,
    comparePrice: null,
    badge: "New Silhouette",
    rating: 4.9,
    reviewsCount: 54,
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: [
      { name: "Chalk & Titanium", hex: "#dedcd8" },
      { name: "Triple Black", hex: "#161718" }
    ],
    image: "assets/images/sneakers-runner.jpg",
    description: "Architectural chunky platform runner crafted with engineered mesh, suede paneling, and an energy-returning dual-density cushioned exoskeleton sole unit.",
    details: [
      "Monofilament technical mesh and Italian calf suede",
      "Ergonomic quick-toggle lacing mechanism",
      "Vibram® custom lug rubber outsole",
      "Reflective 3M Scotchlite detailing"
    ],
    fit: "True to size. Half sizes should round up to the nearest whole size.",
    inStock: true,
    stockCount: 8,
    isNew: true,
    featured: true,
    hotspot: { x: 77, y: 88, label: "Neo-Shift Runner ($295)" }
  },
  {
    id: "prod-05",
    name: "Vintage Wash 'Until Now' Graphic Tee",
    category: "tees",
    categoryLabel: "T-Shirts",
    price: 95,
    comparePrice: 110,
    badge: "Best Seller",
    rating: 4.7,
    reviewsCount: 89,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Carbon", hex: "#222324" },
      { name: "Bleached Ecru", hex: "#edece8" }
    ],
    image: "assets/images/tee-vintage.jpg",
    description: "Heavyweight 280GSM single jersey cotton tee treated with a proprietary silicone and mineral wash. Features conceptual studio typography screen-printed in cracked ink.",
    details: [
      "280GSM Combed Cotton Single Jersey",
      "Hand-distressed raw collar trim",
      "Pre-shrunk vintage wash treatment",
      "Screen-printed with water-based crackle ink"
    ],
    fit: "Oversized, wide-body streetwear drape with extended sleeve length.",
    inStock: true,
    stockCount: 15,
    isNew: false,
    featured: true,
    hotspot: { x: 56, y: 48, label: "'Until Now' Tee ($95)" }
  },
  {
    id: "prod-06",
    name: "Tactical Crossbody Utility Sling",
    category: "accessories",
    categoryLabel: "Accessories & Bags",
    price: 145,
    comparePrice: null,
    badge: "Modular",
    rating: 5.0,
    reviewsCount: 37,
    sizes: ["One Size"],
    colors: [
      { name: "Matte Black & Blaze Orange", hex: "#18191a" }
    ],
    image: "assets/images/bag-sling.jpg",
    description: "Modular crossbody sling constructed from abrasion-resistant Cordura ballistic nylon. Features paracord accents, rapid-release magnetic clasp, and waterproof internal organizers.",
    details: [
      "1000D Cordura® Ballistic Nylon",
      "German magnetic quick-release chest buckle",
      "Climbing-grade high tensile paracord emergency loop",
      "Padded air-mesh back panel for breathability"
    ],
    fit: "Fully adjustable ergonomic harness fits across the chest or waist.",
    inStock: true,
    stockCount: 9,
    isNew: true,
    featured: false,
    hotspot: { x: 78, y: 66, label: "Crossbody Utility Sling ($145)" }
  },
  {
    id: "prod-07",
    name: "Aether Ripstop Technical Cap",
    category: "accessories",
    categoryLabel: "Headwear",
    price: 75,
    comparePrice: null,
    badge: "Waterproof",
    rating: 4.8,
    reviewsCount: 22,
    sizes: ["Adjustable"],
    colors: [
      { name: "Stealth Graphite", hex: "#1f2124" }
    ],
    image: "assets/images/cap-ripstop.jpg",
    description: "Ultralight 5-panel unstructured cap made with water-shedding micro-ripstop. Features a brushed aluminum slider buckle and laser-perforated breathability ports.",
    details: [
      "Ultralight 70D diamond ripstop nylon",
      "Brushed aircraft-grade aluminum hardware",
      "Moisture-wicking antimicrobial sweatband",
      "Packable foam brim maintains shape"
    ],
    fit: "Adjustable rear nylon strap fits head circumferences from 54cm to 62cm.",
    inStock: true,
    stockCount: 14,
    isNew: false,
    featured: false,
    hotspot: null
  },
  {
    id: "prod-08",
    name: "Titanium Shield Aerodynamic Sunglasses",
    category: "accessories",
    categoryLabel: "Eyewear",
    price: 260,
    comparePrice: 310,
    badge: "Limited Run",
    rating: 4.9,
    reviewsCount: 19,
    sizes: ["One Size"],
    colors: [
      { name: "Brushed Titanium / Obsidian Lens", hex: "#9a9ea4" }
    ],
    image: "assets/images/shades-titanium.jpg",
    description: "Avant-garde wraparound shield sunglasses milled from lightweight brushed titanium alloy. Equipped with category 3 obsidian lenses offering 100% UVA/UVB barrier.",
    details: [
      "CNC-milled Aerospace Grade-2 Titanium chassis",
      "100% UV400 Protection scratch-resistant nylon shield",
      "Laser-etched serial code and model coordinates",
      "Custom anodized aluminum hardshell travel case included"
    ],
    fit: "Wraparound aerodynamic curvature designed to contour the face with zero pressure points.",
    inStock: true,
    stockCount: 5,
    isNew: true,
    featured: true,
    hotspot: null
  }
];

// Currency exchange rates relative to USD
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.78, label: "GBP (£)" },
  JPY: { symbol: "¥", rate: 152.0, label: "JPY (¥)" }
};

// Valid discount promo codes
const PROMO_CODES = {
  VOID10: { type: "percent", value: 10, label: "10% VIP ATELIER DISCOUNT" },
  DROP20: { type: "percent", value: 20, label: "20% FW26 DROP PASS" },
  FREESHIP: { type: "shipping", value: 0, label: "FREE EXPEDITED GLOBAL SHIPPING" }
};
