import { Product, GalleryItem } from './types';

export const BUSINESS_INFO = {
  name: "Tatari Furniture",
  tagline: "Furniture That Completes Your Space.",
  address: "179 Dogon Karfi, Jos, Plateau State, Nigeria",
  phone: "0803 217 4376",
  phoneInternational: "+2348032174376",
  whatsappUrl: "https://wa.me/2348032174376",
  mapUrl: "https://maps.google.com/?q=179+Dogon+Karfi+Jos+Plateau+State+Nigeria",
  description: "A premier furniture store serving customers in Jos and beyond with exquisite craftsmanship, comfort, and timeless interior elegance."
};

export const HERO_SLIDES = [
  {
    id: 1,
    title: "FURNITURE THAT COMPLETES YOUR SPACE.",
    subtitle: "Discover furniture designed to bring comfort, character and style into your home.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85",
    badge: "Mastercrafted Living Spaces"
  },
  {
    id: 2,
    title: "TIMELESS ELEGANCE FOR EVERY ROOM.",
    subtitle: "From luxurious sectional sofas to refined bedroom suites crafted for absolute relaxation.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=85",
    badge: "Signature Living Sets"
  },
  {
    id: 3,
    title: "BESPOKE CUSTOM FURNITURE.",
    subtitle: "Tailored to your precise dimensions, aesthetic preferences, and lifestyle needs.",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1920&q=85",
    badge: "Custom Craftsmanship"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "l-1",
    name: "The Royal Executive Sectional Sofa",
    category: "living-room",
    categoryLabel: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
    description: "Plush, deep-seated sectional sofa upholstered in premium fabric with high-density cushioning designed for luxurious family gatherings and formal reception.",
    features: ["High-density foam core", "Stain-resistant textured upholstery", "Solid kiln-dried hardwood frame"],
    materials: "Premium Velvet & Hardwood"
  },
  {
    id: "l-2",
    name: "Aosta Modern Velvet 3-Seater",
    category: "living-room",
    categoryLabel: "Living Room",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85",
    description: "An iconic silhouette featuring elegant tufted detailing and tapered wooden legs. Built to anchor any contemporary living room with sophistication.",
    features: ["Ergonomic lumbar support", "Reinforced corner blocking", "Custom color options available"],
    materials: "Soft Bouclé Fabric & Walnut Wood"
  },
  {
    id: "l-3",
    name: "Dogon Karfi Center Table Set",
    category: "living-room",
    categoryLabel: "Living Room",
    image: "https://images.unsplash.com/photo-1533779283484-8ab4940aa78f?auto=format&fit=crop&w=1200&q=85",
    description: "A harmonious nested coffee table and side table combination featuring rich walnut finishes and brushed gold accents.",
    features: ["Scratch-resistant polished top", "Nesting modular versatility", "Sturdy metallic base"],
    materials: "Solid Walnut & Brushed Brass"
  },
  {
    id: "l-4",
    name: "Jos Grand Accent Armchair",
    category: "living-room",
    categoryLabel: "Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
    description: "A statement armchair offering generous seating depth and wrap-around backrest support for ultimate reading or relaxation.",
    features: ["360-degree smooth swivel base (optional)", "Plush feather-blend cushion insert"],
    materials: "Woven Linen & Dark Walnut"
  },
  {
    id: "b-1",
    name: "Plateau Imperial King Bed Frame",
    category: "bedroom",
    categoryLabel: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
    description: "A majestic upholstered headboard with vertical channel tufting, creating a tranquil and luxurious focal point for your master bedroom.",
    features: ["Heavy-duty slat support system", "Sound-dampening silent frame construction", "Compatible with all standard mattresses"],
    materials: "Upholstered Fabric & African Mahogany"
  },
  {
    id: "b-2",
    name: "Sanctuary 6-Door Wardrobe",
    category: "bedroom",
    categoryLabel: "Bedroom",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85",
    description: "Spacious wardrobe featuring multi-compartment shelving, hanging rails, and soft-close mirrored doors for effortless bedroom organization.",
    features: ["Full-length dressing mirrors", "Lockable jewellery drawers", "Integrated LED wardrobe lighting"],
    materials: "Engineered Wood & Mirrored Glass"
  },
  {
    id: "b-3",
    name: "Minimalist Walnut Bedside Dresser",
    category: "bedroom",
    categoryLabel: "Bedroom",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=85",
    description: "Sleek two-drawer bedside table designed with clean lines and smooth gliding drawers for night-time essentials.",
    features: ["Soft-close drawer mechanism", "Durable water-resistant finish"],
    materials: "Walnut Veneer"
  },
  {
    id: "c-1",
    name: "Custom Executive Office Suite",
    category: "custom",
    categoryLabel: "Custom Furniture",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
    description: "Tailored executive desk and matching credenza designed to elevate private home studies and corporate boardrooms.",
    features: ["Integrated cable management", "Customizable dimensions", "Hand-finished timber grain"],
    materials: "Selected Hardwoods"
  },
  {
    id: "c-2",
    name: "Bespoke Dining Table & Chairs",
    category: "custom",
    categoryLabel: "Custom Furniture",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85",
    description: "Custom-built dining set tailored to seat your family and guests comfortably, crafted with durability and unforgettable aesthetics in mind.",
    features: ["Seats 6 to 12 guests", "Custom stain finishes available"],
    materials: "Solid Mahogany & Upholstered Leather"
  },
  {
    id: "o-1",
    name: "Console & Entryway Credenza",
    category: "other",
    categoryLabel: "Other Furniture",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85",
    description: "An elegant slimline console table designed for grand entryways, hallways, or behind living room sofas.",
    features: ["Slim profile for compact spaces", "Durable display surface"],
    materials: "Oak & Brushed Metal"
  },
  {
    id: "o-2",
    name: "Lounge Ottoman & Footstool",
    category: "other",
    categoryLabel: "Other Furniture",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85",
    description: "Versatile upholstered ottoman that doubles as extra seating or a comfortable footrest.",
    features: ["Multi-functional use", "Lightweight and portable"],
    materials: "Textured Fabric"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "Luxury Living Room Display",
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    description: "An expansive living room layout featuring our signature sectional sofa and ambient lighting in Jos."
  },
  {
    id: "g-2",
    title: "Master Bedroom Suite",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
    description: "Serene bedroom setup showcasing the Plateau Imperial king bed and matching nightstands."
  },
  {
    id: "g-3",
    title: "Showroom Interior Walkthrough",
    category: "Showroom",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
    description: "A glimpse inside our showroom at 179 Dogon Karfi, displaying our curated collections."
  },
  {
    id: "g-4",
    title: "Bespoke Dining Craftsmanship",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85",
    description: "Detailed view of our custom dining table construction highlighting natural wood textures."
  },
  {
    id: "g-5",
    title: "Modern Executive Office",
    category: "Interiors",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
    description: "Custom executive office furniture solution crafted for professional productivity."
  },
  {
    id: "g-6",
    title: "Contemporary Seating Arrangement",
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85",
    description: "Stylish armchair pairing creating a cozy nook for relaxation."
  },
  {
    id: "g-7",
    title: "Wardrobe & Storage Detail",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85",
    description: "High-capacity wardrobe integration designed for modern residential needs."
  },
  {
    id: "g-8",
    title: "Showroom Ambiance",
    category: "Showroom",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85",
    description: "Warm lighting and elegant furniture arrangements welcoming visitors in Jos."
  }
];
