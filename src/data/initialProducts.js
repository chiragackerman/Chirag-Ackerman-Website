const heroDeskImg = '/src/assets/images/hero_setup_desk_1790324766242.jpg';
const keyboardImg = '/src/assets/images/setup_keyboard_detail_1790324779922.jpg';
const mouseImg = '/src/assets/images/setup_mouse_detail_1790324791855.jpg';
const headsetImg = '/src/assets/images/setup_audio_headset_1790324803540.jpg';

export const initialProducts = [
  {
    id: "eweadn-x23-pro",
    name: "EWEADN X23 Pro Wireless Mouse",
    brand: "EWEADN",
    category: "gaming-mice",
    categoryName: "Gaming Mice",
    platform: "Amazon",
    storeName: "Amazon India",
    affiliateUrl: "https://www.amazon.in/s?k=EWEADN+X23+Pro",
    image: mouseImg,
    shortDescription: "Ultralight wireless gaming mouse featuring low-latency sensor and ergonomic thumb support for daily coding and aim training.",
    description: "The EWEADN X23 Pro is an ultralight tri-mode wireless gaming mouse designed for swift glide and reliable tracking. Built with crisp switches, low click latency, and a sculpted profile that provides wrist comfort during extended programming sessions and FPS sessions.",
    price: 1899,
    currency: "₹",
    featured: true,
    published: true,
    tags: ["Wireless", "Ultralight", "RGB", "Ergonomic"],
    specifications: [
      { key: "Connectivity", value: "2.4GHz Wireless / Bluetooth / Type-C" },
      { key: "Sensor", value: "High Precision Optical Sensor" },
      { key: "Weight", value: "Lightweight Chassis (~65g)" },
      { key: "Battery Life", value: "Up to 50 hours on single charge" }
    ],
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z"
  },
  {
    id: "ant-esports-mk1300-v2",
    name: "Ant Esports MK1300 V2 Mechanical Keyboard",
    brand: "Ant Esports",
    category: "keyboards",
    categoryName: "Keyboards",
    platform: "Amazon",
    storeName: "Amazon India",
    affiliateUrl: "https://www.amazon.in/s?k=Ant+Esports+MK1300+V2",
    image: keyboardImg,
    shortDescription: "Compact mechanical keyboard featuring responsive mechanical switches and clean backlighting for typing and gaming.",
    description: "The Ant Esports MK1300 V2 combines a space-saving layout with durable mechanical switches that offer satisfying tactile feedback. Ideal for minimal desk setups where extra mouse travel space is needed.",
    price: 1999,
    currency: "₹",
    featured: true,
    published: true,
    tags: ["Mechanical", "Compact", "LED Backlit", "Tactile"],
    specifications: [
      { key: "Switch Type", value: "Responsive Mechanical Switches" },
      { key: "Form Factor", value: "Compact Tenkeyless / 65%" },
      { key: "Keycaps", value: "Double-shot Injection Keycaps" },
      { key: "Cable", value: "Detachable Braided Type-C" }
    ],
    createdAt: "2026-02-12T10:00:00.000Z",
    updatedAt: "2026-03-02T12:00:00.000Z"
  },
  {
    id: "noctwls-desk-mat",
    name: "Noctwls Minimalist Desk Mat",
    brand: "Noctwls",
    category: "desk-mats",
    categoryName: "Desk Mats",
    platform: "Brand Website",
    storeName: "Brand Store",
    affiliateUrl: "https://www.amazon.in/s?k=Noctwls+desk+mat",
    image: keyboardImg,
    shortDescription: "Premium micro-textured desk pad with reinforced edge stitching and rubberized anti-slip grip.",
    description: "A wide, understated desk mat crafted to provide smooth mouse glide, cushion wrists during heavy keyboard sessions, and dampen desk resonance.",
    price: 899,
    currency: "₹",
    featured: true,
    published: true,
    tags: ["Minimalist", "Anti-Slip", "Extended Size", "Micro-Weave"],
    specifications: [
      { key: "Dimensions", value: "900mm x 400mm x 4mm" },
      { key: "Surface", value: "Water-resistant micro-texture" },
      { key: "Base", value: "Natural non-slip rubber" }
    ],
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-03-05T12:00:00.000Z"
  },
  {
    id: "evofox-gaming-headset",
    name: "Evofox Spatial Sound Gaming Headset",
    brand: "Evofox",
    category: "headsets",
    categoryName: "Headsets",
    platform: "Amazon",
    storeName: "Amazon India",
    affiliateUrl: "https://www.amazon.in/s?k=Evofox+gaming+headset",
    image: headsetImg,
    shortDescription: "Over-ear headset equipped with 50mm neodymium audio drivers and noise-canceling boom microphone.",
    description: "Comfortable memory foam ear cushions paired with clear positional audio allow accurate soundstage awareness in tactical games and crisp voice clarity in Discord meetings.",
    price: 1499,
    currency: "₹",
    featured: true,
    published: true,
    tags: ["50mm Drivers", "Memory Foam", "Spatial Audio", "Mic"],
    specifications: [
      { key: "Driver Unit", value: "50mm Neodymium" },
      { key: "Earcups", value: "Breathable Memory Foam" },
      { key: "Microphone", value: "Omni-directional with Windscreen" }
    ],
    createdAt: "2026-02-18T10:00:00.000Z",
    updatedAt: "2026-03-08T12:00:00.000Z"
  },
  {
    id: "aluminum-dual-laptop-stand",
    name: "Heavy-Duty Aluminum Laptop Stand",
    brand: "Generic Studio Gear",
    category: "laptop-accessories",
    categoryName: "Laptop Accessories",
    platform: "Amazon",
    storeName: "Amazon India",
    affiliateUrl: "https://www.amazon.in/s?k=aluminum+laptop+stand+riser",
    image: heroDeskImg,
    shortDescription: "Foldable dual-pivot aluminum riser designed for ergonomic eye-level posture and improved ventilation.",
    description: "Raises your laptop display to natural eye level to prevent neck stiffness during long coding marathons. Cutout channels facilitate airflow for quiet thermal performance.",
    price: 1299,
    currency: "₹",
    featured: false,
    published: true,
    tags: ["Ergonomic", "Aluminum", "Thermal Ventilation", "Foldable"],
    specifications: [
      { key: "Material", value: "Anodized Aerospace Aluminum" },
      { key: "Compatibility", value: "11-inch to 17-inch Laptops" },
      { key: "Adjustment", value: "Dual hinge angle and elevation" }
    ],
    createdAt: "2026-02-20T10:00:00.000Z",
    updatedAt: "2026-03-10T12:00:00.000Z"
  },
  {
    id: "ambient-purple-screenbar",
    name: "Diffused Monitor Light Bar & Backlight",
    brand: "Studio Lighting",
    category: "rgb-lighting",
    categoryName: "RGB & Lighting",
    platform: "Other Affiliate Store",
    storeName: "Affiliate Partner",
    affiliateUrl: "https://www.amazon.in/s?k=monitor+lightbar+rgb",
    image: heroDeskImg,
    shortDescription: "Asymmetric screenbar that illuminates your desk surface without screen glare, featuring atmospheric ambient backglow.",
    description: "Sits cleanly atop the monitor bezel to shed balanced light across your keyboard and notepad without casting reflections on the monitor glass.",
    price: 2499,
    currency: "₹",
    featured: false,
    published: true,
    tags: ["Zero Glare", "Dual Zone", "Touch Sensor", "USB Powered"],
    specifications: [
      { key: "Light Distribution", value: "Asymmetric Optical Light" },
      { key: "Color Temperature", value: "2700K - 6500K Adjustable" },
      { key: "Control", value: "Touch Bar / Wireless Dial" }
    ],
    createdAt: "2026-02-22T10:00:00.000Z",
    updatedAt: "2026-03-12T12:00:00.000Z"
  }
];
