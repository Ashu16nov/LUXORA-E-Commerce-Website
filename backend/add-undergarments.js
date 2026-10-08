require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const undergarmentProducts = [
  {
    name: "LUXORA Couture Seamless Silk Satin Lingerie Set",
    brand: "LUXORA",
    category: "Women",
    subCategory: "Lingerie",
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    rating: 4.9,
    numReviews: 142,
    stock: 30,
    description: "Ultra-luxurious seamless silk satin bra and panty couture set with wireless plunge cups, gold metal accents, and dynamic breathable stretch fit.",
    images: [
      "https://images.unsplash.com/photo-1596475658507-4228c2c77d54?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Nude Gold", "Midnight Black", "Emerald"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "Calvin Klein Modern Cotton Bralette & Thong Set",
    brand: "Calvin Klein",
    category: "Women",
    subCategory: "Lingerie",
    price: 2199,
    originalPrice: 2999,
    discount: 26,
    rating: 4.8,
    numReviews: 210,
    stock: 40,
    description: "Iconic modern cotton racerback bralette with signature Calvin Klein logo band and matching ultra-soft stretch thong.",
    images: [
      "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=900&q=85"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Heather Grey", "White", "Black"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "LUXORA Sheer Floral Lace Bustier Corset Bra",
    brand: "LUXORA",
    category: "Women",
    subCategory: "Lingerie",
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    rating: 4.9,
    numReviews: 98,
    stock: 22,
    description: "Handcrafted delicate sheer floral lace bustier top with boning structure, scalloped hemline, and adjustable velvet shoulder straps.",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Crimson Red", "Obsidian Black", "Pearl White"],
    offer: false,
    featured: true,
    trending: true
  },
  {
    name: "Marks & Spencer Smooth Contour T-Shirt Bra 2-Pack",
    brand: "Marks & Spencer",
    category: "Women",
    subCategory: "Lingerie",
    price: 1999,
    originalPrice: 2799,
    discount: 28,
    rating: 4.7,
    numReviews: 76,
    stock: 35,
    description: "Invisible t-shirt contour bra pair crafted from smooth microfibre with zero-line laser cut edges for absolute discretion under any outfit.",
    images: [
      "https://images.unsplash.com/photo-1583391733975-d2279b9bf8b7?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Beige", "Classic White"],
    offer: true,
    featured: false,
    trending: false
  },
  {
    name: "Calvin Klein Micro Modal Trunk Briefs (3-Pack)",
    brand: "Calvin Klein",
    category: "Men",
    subCategory: "Underwear",
    price: 2299,
    originalPrice: 3199,
    discount: 28,
    rating: 4.9,
    numReviews: 310,
    stock: 45,
    description: "Ultra-soft modal stretch trunk briefs featuring iconic metallic waistband, anti-chafing pouch support, and 360-degree flexible movement.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy Blue", "Charcoal Grey"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "LUXORA Egyptian Cotton Seamless Boxer Briefs",
    brand: "LUXORA",
    category: "Men",
    subCategory: "Underwear",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.8,
    numReviews: 128,
    stock: 50,
    description: "Luxurious Egyptian combed cotton boxer briefs with continuous moisture-wicking technology, ergonomic contour pouch, and gold foil logo waistband.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Royal Navy", "Jet Black", "Champagne Gold"],
    offer: false,
    featured: true,
    trending: true
  },
  {
    name: "Tommy Hilfiger Pure Cotton Boxer Shorts (2-Pack)",
    brand: "Tommy Hilfiger",
    category: "Men",
    subCategory: "Underwear",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    rating: 4.7,
    numReviews: 95,
    stock: 32,
    description: "Relaxed fit pure cotton woven boxer shorts featuring elasticated signature flag waistband and functional button fly closure.",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85"
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Navy Stripe", "Classic Red/White"],
    offer: true,
    featured: false,
    trending: true
  },
  {
    name: "LUXORA Ribbed Contour Innerwear Vests (2-Pack)",
    brand: "LUXORA",
    category: "Men",
    subCategory: "Underwear",
    price: 1299,
    originalPrice: 1699,
    discount: 23,
    rating: 4.8,
    numReviews: 64,
    stock: 28,
    description: "Seamless rib-knit innerwear vest with contoured fit, deep scoop neck, and anti-bacterial bamboo-cotton fabric.",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pure White", "Slate Grey"],
    offer: true,
    featured: false,
    trending: false
  }
];

const main = async () => {
  await connectDB();
  for (const p of undergarmentProducts) {
    await Product.updateOne(
      { name: p.name },
      { $set: p },
      { upsert: true }
    );
  }
  console.log(`[LUXORA SUCCESS] ${undergarmentProducts.length} undergarment products upserted successfully to MongoDB.`);
  process.exit(0);
};

main().catch(err => {
  console.error(`[LUXORA ERROR] Failed to upsert products:`, err);
  process.exit(1);
});
