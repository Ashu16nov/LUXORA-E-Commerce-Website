const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();

connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@luxora.com',
    password: 'p@ssword123',
    isAdmin: true,
  },
  {
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'test@123',
  },
];

const products = [
  {
    "name": "Women Ethnic Motifs Printed Kurta",
    "brand": "Biba",
    "category": "Women",
    "subCategory": "Kurtas",
    "price": 909,
    "originalPrice": 1299,
    "discount": 30,
    "rating": 4.4,
    "numReviews": 56,
    "stock": 15,
    "description": "Pink & white ethnic motifs printed straight calf-length kurta. Features a classic V-neck, three-quarter regular sleeves, straight hemline, side slits, and crafted from 100% premium breathable woven cotton.",
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    "colors": ["Pink", "White"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Y2K Ribbed Tank Top",
    "brand": "Zara",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 699,
    "originalPrice": 1299,
    "discount": 46,
    "rating": 4.8,
    "numReviews": 124,
    "stock": 20,
    "description": "Trendy ribbed stretch knit Y2K crop tank top with scoop neckline and minimalist aesthetic.",
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85"
    ],
    "sizes": ["XS", "S", "M", "L"],
    "colors": ["Black", "White", "Pastel Pink"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Ripped Distressed Accidental Jeans",
    "brand": "Urban Outfitters",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 2199,
    "originalPrice": 3499,
    "discount": 37,
    "rating": 4.9,
    "numReviews": 88,
    "stock": 18,
    "description": "High-waist accidental ripped denim jeans with baggy fit, distressed knee slash details, and urban streetwear vibe.",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85"
    ],
    "sizes": ["26", "28", "30", "32"],
    "colors": ["Washed Blue", "Vintage Grey"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Fancy Velvet Bralette Bustier",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 1199,
    "originalPrice": 1999,
    "discount": 40,
    "rating": 4.7,
    "numReviews": 62,
    "stock": 15,
    "description": "Luxury plush velvet bralette top with sweetheart neckline, delicate lace trim, and adjustable straps.",
    "images": [
      "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=900&q=85"
    ],
    "sizes": ["S", "M", "L"],
    "colors": ["Burgundy", "Emerald", "Black"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Cut-Out Satin Micro Mini Dress",
    "brand": "Mango",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 1899,
    "originalPrice": 2999,
    "discount": 36,
    "rating": 4.8,
    "numReviews": 95,
    "stock": 12,
    "description": "Glamorous satin mini bodycon dress featuring side cut-outs, tie-up halter neck, and asymmetrical hemline.",
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85"
    ],
    "sizes": ["XS", "S", "M"],
    "colors": ["Crimson Red", "Champagne Gold"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Seamless Lace Bralette Crop Top",
    "brand": "H&M",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 899,
    "originalPrice": 1499,
    "discount": 40,
    "rating": 4.6,
    "numReviews": 73,
    "stock": 25,
    "description": "Soft stretch seamless floral lace bralette with padded cups and stylish criss-cross back straps.",
    "images": [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85"
    ],
    "sizes": ["S", "M", "L"],
    "colors": ["White", "Black", "Nude"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Aesthetic Mesh Backless Party Top",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "GenZ",
    "price": 1499,
    "originalPrice": 2499,
    "discount": 40,
    "rating": 4.9,
    "numReviews": 110,
    "stock": 16,
    "description": "Chic sheer mesh long-sleeve crop top with open back detailing and ruched front accent.",
    "images": [
      "https://images.unsplash.com/photo-1583391733975-d2279b9bf8b7?w=900&q=85"
    ],
    "sizes": ["S", "M", "L"],
    "colors": ["Black Mesh", "Iridescent Silver"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Classic White Shirt",
    "brand": "LUXORA",
    "category": "Men",
    "subCategory": "Shirts",
    "price": 1500,
    "originalPrice": 2000,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80"
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "offer": false,
    "featured": true
  },
  {
    "name": "Denim Jacket",
    "brand": "Levi's",
    "category": "Men",
    "subCategory": "Jackets",
    "price": 3500,
    "originalPrice": 4500,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&q=80"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "offer": false,
    "featured": true
  },
  {
    "name": "Slim Fit Chinos",
    "brand": "Zara",
    "category": "Men",
    "subCategory": "Trousers",
    "price": 2499,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80"
    ],
    "sizes": [
      "30",
      "32",
      "34"
    ],
    "colors": [
      "Beige"
    ],
    "offer": false
  },
  {
    "name": "Polo T-Shirt",
    "brand": "H&M",
    "category": "Men",
    "subCategory": "T-Shirts",
    "price": 999,
    "originalPrice": 1299,
    "discount": 23,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Black"
    ],
    "offer": true,
    "featured": false
  },
  {
    "name": "Casual Sneakers",
    "brand": "Nike",
    "category": "Men",
    "subCategory": "Shoes",
    "price": 4999,
    "originalPrice": 5999,
    "discount": 16,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80"
    ],
    "sizes": [
      "8",
      "9",
      "10"
    ],
    "colors": [
      "White"
    ],
    "offer": false,
    "trending": true
  },
  {
    "name": "Formal Suit",
    "brand": "LUXORA",
    "category": "Men",
    "subCategory": "Suits",
    "price": 12000,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=500&q=80"
    ],
    "sizes": [
      "38",
      "40",
      "42"
    ],
    "colors": [
      "Black",
      "Navy"
    ],
    "offer": false
  },
  {
    "name": "Leather Boots",
    "brand": "LUXORA",
    "category": "Men",
    "subCategory": "Shoes",
    "price": 5999,
    "originalPrice": 7999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80"
    ],
    "sizes": [
      "8",
      "9",
      "10"
    ],
    "colors": [
      "Brown"
    ],
    "offer": true
  },
  {
    "name": "Graphic Hoodie",
    "brand": "Puma",
    "category": "Men",
    "subCategory": "Hoodies",
    "price": 1899,
    "originalPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
    ],
    "sizes": [
      "M",
      "L"
    ],
    "colors": [
      "Grey"
    ],
    "offer": true,
    "trending": true
  },
  {
    "name": "Linen Shorts",
    "brand": "Zara",
    "category": "Men",
    "subCategory": "Shorts",
    "price": 1299,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80"
    ],
    "sizes": [
      "30",
      "32"
    ],
    "colors": [
      "Khaki"
    ],
    "offer": false
  },
  {
    "name": "Striped T-Shirt",
    "brand": "H&M",
    "category": "Men",
    "subCategory": "T-Shirts",
    "price": 799,
    "originalPrice": 1599,
    "discount": 50,
    "images": [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80"
    ],
    "sizes": [
      "M",
      "L"
    ],
    "colors": [
      "White/Blue"
    ],
    "offer": true,
    "clearance": true
  },
  {
    "name": "Floral Summer Dress",
    "brand": "Zara",
    "category": "Women",
    "subCategory": "Dresses",
    "price": 2499,
    "originalPrice": 3499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Red"
    ],
    "offer": true,
    "featured": true
  },
  {
    "name": "High-Waist Jeans",
    "brand": "H&M",
    "category": "Women",
    "subCategory": "Jeans",
    "price": 1999,
    "originalPrice": 2499,
    "discount": 20,
    "images": [
      "https://images.unsplash.com/photo-1542272604-780287c80084?w=500&q=80"
    ],
    "sizes": [
      "28",
      "30"
    ],
    "colors": [
      "Blue"
    ],
    "offer": false,
    "trending": true
  },
  {
    "name": "Silk Blouse",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "Tops",
    "price": 2200,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M"
    ],
    "colors": [
      "White"
    ],
    "offer": false,
    "featured": true
  },
  {
    "name": "Pleated Skirt",
    "brand": "Zara",
    "category": "Women",
    "subCategory": "Skirts",
    "price": 1599,
    "originalPrice": 1999,
    "discount": 20,
    "images": [
      "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M"
    ],
    "colors": [
      "Beige"
    ],
    "offer": false
  },
  {
    "name": "Running Shoes",
    "brand": "Nike",
    "category": "Women",
    "subCategory": "Shoes",
    "price": 5499,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80"
    ],
    "sizes": [
      "6",
      "7",
      "8"
    ],
    "colors": [
      "Pink"
    ],
    "offer": false,
    "trending": true
  },
  {
    "name": "Elegant Kurti",
    "brand": "Biba",
    "category": "Women",
    "subCategory": "Kurtis",
    "price": 1800,
    "originalPrice": 2000,
    "discount": 10,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80"
    ],
    "sizes": [
      "M",
      "L"
    ],
    "colors": [
      "Green"
    ],
    "offer": true
  },
  {
    "name": "Leather Jacket",
    "brand": "Mango",
    "category": "Women",
    "subCategory": "Jackets",
    "price": 4999,
    "originalPrice": 6999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M"
    ],
    "colors": [
      "Black"
    ],
    "offer": true,
    "trending": true
  },
  {
    "name": "Yoga Pants",
    "brand": "Nike",
    "category": "Women",
    "subCategory": "Activewear",
    "price": 1599,
    "originalPrice": 3198,
    "discount": 50,
    "images": [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M"
    ],
    "colors": [
      "Black"
    ],
    "offer": true,
    "clearance": true
  },
  {
    "name": "Party Gown",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "Dresses",
    "price": 8999,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M"
    ],
    "colors": [
      "Navy"
    ],
    "offer": false,
    "featured": true
  },
  {
    "name": "Basic V-Neck T-Shirt",
    "brand": "H&M",
    "category": "Women",
    "subCategory": "Tops",
    "price": 499,
    "originalPrice": 999,
    "discount": 50,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "White"
    ],
    "offer": true,
    "clearance": true
  },
  {
    "name": "Boys Cotton T-Shirt",
    "brand": "Puma",
    "category": "Kids",
    "subCategory": "Boys",
    "price": 699,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500&q=80"
    ],
    "sizes": [
      "4-5Y",
      "6-7Y"
    ],
    "colors": [
      "Red"
    ],
    "offer": false
  },
  {
    "name": "Girls Party Dress",
    "brand": "Allen Solly Kids",
    "category": "Kids",
    "subCategory": "Girls",
    "price": 1499,
    "originalPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80"
    ],
    "sizes": [
      "4-5Y"
    ],
    "colors": [
      "Pink"
    ],
    "offer": true
  },
  {
    "name": "Kids Denim Overalls",
    "brand": "Levi's",
    "category": "Kids",
    "subCategory": "Unisex",
    "price": 1299,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&q=80"
    ],
    "sizes": [
      "2-3Y",
      "4-5Y"
    ],
    "colors": [
      "Blue"
    ],
    "offer": false
  },
  {
    "name": "Sneakers for Boys",
    "brand": "Nike",
    "category": "Kids",
    "subCategory": "Shoes",
    "price": 2499,
    "originalPrice": 2999,
    "discount": 16,
    "images": [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80"
    ],
    "sizes": [
      "11",
      "12"
    ],
    "colors": [
      "Black"
    ],
    "offer": true,
    "trending": true
  },
  {
    "name": "Girls Floral Top",
    "brand": "H&M",
    "category": "Kids",
    "subCategory": "Girls",
    "price": 899,
    "originalPrice": 1798,
    "discount": 50,
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80"
    ],
    "sizes": [
      "6-7Y"
    ],
    "colors": [
      "White/Floral"
    ],
    "offer": true,
    "clearance": true
  },
  {
    "name": "Boys Chino Shorts",
    "brand": "Zara",
    "category": "Kids",
    "subCategory": "Boys",
    "price": 1099,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&q=80"
    ],
    "sizes": [
      "8-9Y"
    ],
    "colors": [
      "Beige"
    ],
    "offer": false
  },
  {
    "name": "Kids Winter Jacket",
    "brand": "LUXORA",
    "category": "Kids",
    "subCategory": "Unisex",
    "price": 2999,
    "originalPrice": 3999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&q=80"
    ],
    "sizes": [
      "6-7Y"
    ],
    "colors": [
      "Navy"
    ],
    "offer": true
  },
  {
    "name": "School Backpack",
    "brand": "Puma",
    "category": "Kids",
    "subCategory": "Accessories",
    "price": 1299,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Blue"
    ],
    "offer": false
  },
  {
    "name": "Leather Tote Bag",
    "brand": "Coach",
    "category": "Accessories",
    "subCategory": "Bags",
    "price": 8999,
    "originalPrice": 12000,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Brown"
    ],
    "offer": true,
    "featured": true
  },
  {
    "name": "Chronograph Watch",
    "brand": "Fossil",
    "category": "Accessories",
    "subCategory": "Watches",
    "price": 7500,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Silver"
    ],
    "offer": false,
    "trending": true
  },
  {
    "name": "Aviator Sunglasses",
    "brand": "Ray-Ban",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "price": 5499,
    "originalPrice": 6500,
    "discount": 15,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Gold"
    ],
    "offer": true
  },
  {
    "name": "Silk Tie",
    "brand": "LUXORA",
    "category": "Accessories",
    "subCategory": "Ties",
    "price": 1200,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1589756804153-61a0ed27b407?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Navy"
    ],
    "offer": false
  },
  {
    "name": "Minimalist Wallet",
    "brand": "H&M",
    "category": "Accessories",
    "subCategory": "Wallets",
    "price": 799,
    "originalPrice": 1598,
    "discount": 50,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Black"
    ],
    "offer": true,
    "clearance": true
  },
  {
    "name": "Wool Scarf",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Scarves",
    "price": 1499,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1520903073617-573bf2002324?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Grey"
    ],
    "offer": false
  },
  {
    "name": "Silver Necklace",
    "brand": "LUXORA",
    "category": "Accessories",
    "subCategory": "Jewelry",
    "price": 2999,
    "discount": 0,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Silver"
    ],
    "offer": false,
    "featured": true
  },
  {
    "name": "Leather Belt",
    "brand": "Levi's",
    "category": "Accessories",
    "subCategory": "Belts",
    "price": 1599,
    "originalPrice": 1999,
    "discount": 20,
    "images": [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80"
    ],
    "sizes": [
      "One Size"
    ],
    "colors": [
      "Brown"
    ],
    "offer": true
  },
  {
    "name": "LUXORA Couture Seamless Silk Satin Lingerie Set",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "Lingerie",
    "price": 1799,
    "originalPrice": 2499,
    "discount": 28,
    "rating": 4.9,
    "numReviews": 142,
    "stock": 30,
    "description": "Ultra-luxurious seamless silk satin bra and panty couture set with wireless plunge cups, gold metal accents, and dynamic breathable stretch fit.",
    "images": [
      "https://images.unsplash.com/photo-1596475658507-4228c2c77d54?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Nude Gold", "Midnight Black", "Emerald"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "Calvin Klein Modern Cotton Bralette & Thong Set",
    "brand": "Calvin Klein",
    "category": "Women",
    "subCategory": "Lingerie",
    "price": 2199,
    "originalPrice": 2999,
    "discount": 26,
    "rating": 4.8,
    "numReviews": 210,
    "stock": 40,
    "description": "Iconic modern cotton racerback bralette with signature Calvin Klein logo band and matching ultra-soft stretch thong.",
    "images": [
      "https://images.unsplash.com/photo-1564222256577-45e728f2c611?w=900&q=85"
    ],
    "sizes": ["XS", "S", "M", "L"],
    "colors": ["Heather Grey", "White", "Black"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "LUXORA Sheer Floral Lace Bustier Corset Bra",
    "brand": "LUXORA",
    "category": "Women",
    "subCategory": "Lingerie",
    "price": 2499,
    "originalPrice": 3499,
    "discount": 28,
    "rating": 4.9,
    "numReviews": 98,
    "stock": 22,
    "description": "Handcrafted delicate sheer floral lace bustier top with boning structure, scalloped hemline, and adjustable velvet shoulder straps.",
    "images": [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85"
    ],
    "sizes": ["S", "M", "L"],
    "colors": ["Crimson Red", "Obsidian Black", "Pearl White"],
    "offer": false,
    "featured": true,
    "trending": true
  },
  {
    "name": "Marks & Spencer Smooth Contour T-Shirt Bra 2-Pack",
    "brand": "Marks & Spencer",
    "category": "Women",
    "subCategory": "Lingerie",
    "price": 1999,
    "originalPrice": 2799,
    "discount": 28,
    "rating": 4.7,
    "numReviews": 76,
    "stock": 35,
    "description": "Invisible t-shirt contour bra pair crafted from smooth microfibre with zero-line laser cut edges for absolute discretion under any outfit.",
    "images": [
      "https://images.unsplash.com/photo-1583391733975-d2279b9bf8b7?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Rose Beige", "Classic White"],
    "offer": true,
    "featured": false,
    "trending": false
  },
  {
    "name": "Calvin Klein Micro Modal Trunk Briefs (3-Pack)",
    "brand": "Calvin Klein",
    "category": "Men",
    "subCategory": "Underwear",
    "price": 2299,
    "originalPrice": 3199,
    "discount": 28,
    "rating": 4.9,
    "numReviews": 310,
    "stock": 45,
    "description": "Ultra-soft modal stretch trunk briefs featuring iconic metallic waistband, anti-chafing pouch support, and 360-degree flexible movement.",
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Black", "Navy Blue", "Charcoal Grey"],
    "offer": true,
    "featured": true,
    "trending": true
  },
  {
    "name": "LUXORA Egyptian Cotton Seamless Boxer Briefs",
    "brand": "LUXORA",
    "category": "Men",
    "subCategory": "Underwear",
    "price": 1499,
    "originalPrice": 1999,
    "discount": 25,
    "rating": 4.8,
    "numReviews": 128,
    "stock": 50,
    "description": "Luxurious Egyptian combed cotton boxer briefs with continuous moisture-wicking technology, ergonomic contour pouch, and gold foil logo waistband.",
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Royal Navy", "Jet Black", "Champagne Gold"],
    "offer": false,
    "featured": true,
    "trending": true
  },
  {
    "name": "Tommy Hilfiger Pure Cotton Boxer Shorts (2-Pack)",
    "brand": "Tommy Hilfiger",
    "category": "Men",
    "subCategory": "Underwear",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "rating": 4.7,
    "numReviews": 95,
    "stock": 32,
    "description": "Relaxed fit pure cotton woven boxer shorts featuring elasticated signature flag waistband and functional button fly closure.",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85"
    ],
    "sizes": ["M", "L", "XL"],
    "colors": ["Navy Stripe", "Classic Red/White"],
    "offer": true,
    "featured": false,
    "trending": true
  },
  {
    "name": "LUXORA Ribbed Contour Innerwear Vests (2-Pack)",
    "brand": "LUXORA",
    "category": "Men",
    "subCategory": "Underwear",
    "price": 1299,
    "originalPrice": 1699,
    "discount": 23,
    "rating": 4.8,
    "numReviews": 64,
    "stock": 28,
    "description": "Seamless rib-knit innerwear vest with contoured fit, deep scoop neck, and anti-bacterial bamboo-cotton fabric.",
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=85"
    ],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Pure White", "Slate Grey"],
    "offer": true,
    "featured": false,
    "trending": false
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    // Attach admin user to products if we had a user field, but we don't.
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
