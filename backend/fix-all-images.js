require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const validImageMap = {
  // Women Lingerie / Bras
  "LUXORA Couture Seamless Silk Satin Lingerie Set": "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=800&q=80",
  "Calvin Klein Modern Cotton Bralette & Thong Set": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  "LUXORA Sheer Floral Lace Bustier Corset Bra": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  "Marks & Spencer Smooth Contour T-Shirt Bra 2-Pack": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
  "LUXORA Sculpting Wireless Plunge Balconette Bra": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
  "Victoria's Secret Dream Angels Push-Up Lace Bra": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  "Calvin Klein Perfectly Fit Modern T-Shirt Bra": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  "LUXORA Enchanted Satin Strapless Multi-Way Bra": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  "Marks & Spencer Flexifit Full Cup Everyday Bra (Pack of 2)": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "LUXORA Romantic Sheer Bralette & Longline Bustier": "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=800&q=80",
  "Fancy Velvet Bralette Bustier": "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=800&q=80",
  "Seamless Lace Bralette Crop Top": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  "Aesthetic Mesh Backless Party Top": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  "High-Waist Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  "Leather Jacket": "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80",
  "Silk Tie": "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800&q=80",
  "Wool Scarf": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",

  // Men Underwear & Innerwear
  "Calvin Klein Micro Modal Trunk Briefs (3-Pack)": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  "LUXORA Egyptian Cotton Seamless Boxer Briefs": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  "Tommy Hilfiger Pure Cotton Boxer Shorts (2-Pack)": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
  "LUXORA Ribbed Contour Innerwear Vests (2-Pack)": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
};

const newMenUndergarments = [
  {
    name: "LUXORA Seamless Athletic Compression Briefs",
    brand: "LUXORA",
    category: "Men",
    subCategory: "Underwear",
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    rating: 4.9,
    numReviews: 145,
    stock: 40,
    description: "High-performance seamless compression briefs with ergonomic support pouch, breathable mesh ventilation channels, and zero-chafe flatlock seams.",
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Obsidian Black", "Slate Grey", "Electric Blue"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "Calvin Klein Intense Power Microfiber Trunks (2-Pack)",
    brand: "Calvin Klein",
    category: "Men",
    subCategory: "Underwear",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.8,
    numReviews: 215,
    stock: 35,
    description: "Ultra-stretch silky microfiber trunks featuring bold iconic Calvin Klein logo elastic waistband and maximum leg retention.",
    images: ["https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Pure White"],
    offer: true,
    featured: true,
    trending: true
  },
  {
    name: "LUXORA Signature Bamboo-Cotton Innerwear Vests (Pack of 3)",
    brand: "LUXORA",
    category: "Men",
    subCategory: "Underwear",
    price: 1799,
    originalPrice: 2399,
    discount: 25,
    rating: 4.9,
    numReviews: 180,
    stock: 50,
    description: "Premium ultra-breathable organic bamboo-cotton innerwear vest trio featuring deep scoop neck, invisible under-shirt tailoring, and natural anti-odor treatment.",
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Classic White", "Midnight Black"],
    offer: false,
    featured: true,
    trending: true
  }
];

const main = async () => {
  await connectDB();
  
  // 1. Fix mapped images
  for (const [name, imgUrl] of Object.entries(validImageMap)) {
    await Product.updateOne(
      { name },
      { $set: { images: [imgUrl] } }
    );
  }
  console.log('[LUXORA FIX] Updated broken image URLs in MongoDB.');

  // 2. Add new Men's Undergarments
  for (const p of newMenUndergarments) {
    await Product.updateOne(
      { name: p.name },
      { $set: p },
      { upsert: true }
    );
  }
  console.log('[LUXORA FIX] Added additional Men undergarment products.');

  process.exit(0);
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
