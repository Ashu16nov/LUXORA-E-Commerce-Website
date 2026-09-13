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
    password: 'password123',
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
