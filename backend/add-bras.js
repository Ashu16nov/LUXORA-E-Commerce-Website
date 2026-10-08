require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const braProducts = [
  {
    name: "LUXORA Sculpting Wireless Plunge Balconette Bra",
    brand: "LUXORA",
    category: "Women",
    subCategory: "Lingerie",
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    rating: 4.9,
    numReviews: 184,
    stock: 35,
    description: "Sleek wireless balconette bra engineered with ultra-soft memory foam cups, hidden gold hardware, and zero-dig microfibre wings for invisible support.",
    images: [
      "https://images.unsplash.com/photo-1596475658507-4228c2c77d54?w=900&q=85"
    ],
    sizes: ["32B", "34B", "34C", "36B", "S", "M", "L"],
    colors: ["Nude Beige", "Obsidian Black", "Dusty Rose"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "Victoria's Secret Dream Angels Push-Up Lace Bra",
    brand: "Victoria's Secret",
    category: "Women",
    subCategory: "Lingerie",
    price: 2799,
    originalPrice: 3899,
    discount: 28,
    rating: 4.8,
    numReviews: 240,
    stock: 25,
    description: "Plush memory foam push-up bra crafted from exquisite French floral lace with jewel-encrusted straps and subtle uplift contouring.",
    images: [
      "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=900&q=85"
    ],
    sizes: ["32B", "34B", "34C", "36B", "S", "M", "L"],
    colors: ["Burgundy Red", "Champagne Gold", "Classic White"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "Calvin Klein Perfectly Fit Modern T-Shirt Bra",
    brand: "Calvin Klein",
    category: "Women",
    subCategory: "Lingerie",
    price: 2399,
    originalPrice: 3199,
    discount: 25,
    rating: 4.9,
    numReviews: 320,
    stock: 40,
    description: "Seamless stretch microfibre T-shirt bra featuring smooth underwire support, signature Calvin Klein elastic wings, and convertible multi-way straps.",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85"
    ],
    sizes: ["32A", "32B", "34B", "34C", "36B", "S", "M", "L"],
    colors: ["Black", "Bare Nude", "Heather Grey"],
    offer: false,
    featured: true,
    trending: true
  },
  {
    name: "LUXORA Enchanted Satin Strapless Multi-Way Bra",
    brand: "LUXORA",
    category: "Women",
    subCategory: "Lingerie",
    price: 1999,
    originalPrice: 2799,
    discount: 28,
    rating: 4.7,
    numReviews: 112,
    stock: 30,
    description: "High-shine satin strapless bra with non-slip silicone inner banding, molded contour cups, and detachable straps for backless and halter styling.",
    images: [
      "https://images.unsplash.com/photo-1583391733975-d2279b9bf8b7?w=900&q=85"
    ],
    sizes: ["32B", "34B", "34C", "36B", "S", "M", "L"],
    colors: ["Pearl Ivory", "Midnight Black", "Emerald Satin"],
    offer: true,
    featured: false,
    trending: true
  },
  {
    name: "Marks & Spencer Flexifit Full Cup Everyday Bra (Pack of 2)",
    brand: "Marks & Spencer",
    category: "Women",
    subCategory: "Lingerie",
    price: 2199,
    originalPrice: 2899,
    discount: 24,
    rating: 4.8,
    numReviews: 95,
    stock: 38,
    description: "Innovative Flexifit 360-stretch fabric full coverage bra pair providing natural shaping, moisture-wicking technology, and all-day maximum comfort.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85"
    ],
    sizes: ["34B", "34C", "36B", "36C", "38C", "M", "L", "XL"],
    colors: ["Blush Pink", "Soft Black"],
    offer: true,
    featured: false,
    trending: false
  },
  {
    name: "LUXORA Romantic Sheer Bralette & Longline Bustier",
    brand: "LUXORA",
    category: "Women",
    subCategory: "Lingerie",
    price: 2299,
    originalPrice: 3199,
    discount: 28,
    rating: 4.9,
    numReviews: 156,
    stock: 24,
    description: "Haute couture longline lace bralette with scalloped eyelash lace edge, sheer mesh back panel, and gold hook-and-eye closure.",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Vamp Red", "Midnight Noir", "Soft Rose"],
    offer: true,
    featured: true,
    trending: true
  }
];

const main = async () => {
  await connectDB();
  for (const p of braProducts) {
    await Product.updateOne(
      { name: p.name },
      { $set: p },
      { upsert: true }
    );
  }
  console.log(`[LUXORA SUCCESS] ${braProducts.length} bra collection products upserted successfully to MongoDB.`);
  process.exit(0);
};

main().catch(err => {
  console.error(`[LUXORA ERROR] Failed to upsert bra products:`, err);
  process.exit(1);
});
