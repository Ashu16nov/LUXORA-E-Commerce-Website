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
  // Men
  {
    name: 'Classic White Shirt',
    brand: 'ÉLAN',
    description: 'A crisp, classic white shirt tailored for a perfect fit.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80'],
    sizes: ['M', 'L', 'XL'],
    colors: ['White'],
    rating: 4.5,
    numReviews: 12,
    stock: 50,
    featured: true,
    trending: true,
  },
  {
    name: 'Denim Jacket',
    brand: 'Levi\'s',
    description: 'Vintage blue denim jacket.',
    category: 'Men',
    subCategory: 'Jackets',
    price: 3500,
    originalPrice: 4500,
    discount: 22,
    images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Blue'],
    rating: 4.8,
    numReviews: 25,
    stock: 20,
    featured: true,
  },
  {
    name: 'Casual Sneakers',
    brand: 'Nike',
    description: 'Comfortable everyday sneakers.',
    category: 'Men',
    subCategory: 'Shoes',
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80'],
    sizes: ['8', '9', '10', '11'],
    colors: ['White', 'Black'],
    rating: 4.7,
    numReviews: 40,
    stock: 35,
    trending: true,
  },
  // Women
  {
    name: 'Floral Summer Dress',
    brand: 'Zara',
    description: 'Light and breezy floral dress perfect for summer.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Yellow'],
    rating: 4.9,
    numReviews: 55,
    stock: 15,
    featured: true,
    offer: true,
  },
  {
    name: 'High-Waist Jeans',
    brand: 'H&M',
    description: 'Classic high-waisted denim jeans.',
    category: 'Women',
    subCategory: 'Jeans',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80'],
    sizes: ['28', '30', '32'],
    colors: ['Blue', 'Black'],
    rating: 4.6,
    numReviews: 32,
    stock: 40,
    trending: true,
  },
  {
    name: 'Elegant Kurti',
    brand: 'Biba',
    description: 'Beautiful ethnic kurti with intricate embroidery.',
    category: 'Women',
    subCategory: 'Kurtis',
    price: 1800,
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Green'],
    rating: 4.4,
    numReviews: 18,
    stock: 25,
  },
  // Kids
  {
    name: 'Boys Cotton T-Shirt',
    brand: 'Puma',
    description: 'Soft cotton t-shirt for kids.',
    category: 'Kids',
    subCategory: 'Boys',
    price: 699,
    images: ['https://images.unsplash.com/photo-1519238396255-dd63b15dc6f9?w=500&q=80'],
    sizes: ['4-5Y', '6-7Y', '8-9Y'],
    colors: ['Red', 'Blue'],
    rating: 4.5,
    numReviews: 10,
    stock: 50,
  },
  {
    name: 'Girls Party Dress',
    brand: 'Allen Solly Kids',
    description: 'Sparkling party dress.',
    category: 'Kids',
    subCategory: 'Girls',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80'],
    sizes: ['4-5Y', '6-7Y'],
    colors: ['Pink'],
    rating: 4.8,
    numReviews: 14,
    stock: 12,
    offer: true,
  },
  // Accessories
  {
    name: 'Leather Tote Bag',
    brand: 'Coach',
    description: 'Premium leather tote bag.',
    category: 'Accessories',
    subCategory: 'Bags',
    price: 8999,
    originalPrice: 12000,
    discount: 25,
    images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    rating: 4.9,
    numReviews: 80,
    stock: 10,
    featured: true,
  },
  {
    name: 'Chronograph Watch',
    brand: 'Fossil',
    description: 'Stainless steel analog watch.',
    category: 'Accessories',
    subCategory: 'Watches',
    price: 7500,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80'],
    sizes: ['One Size'],
    colors: ['Silver'],
    rating: 4.7,
    numReviews: 45,
    stock: 15,
    trending: true,
  },
  {
    name: 'Aviator Sunglasses',
    brand: 'Ray-Ban',
    description: 'Classic aviator sunglasses with UV protection.',
    category: 'Accessories',
    subCategory: 'Sunglasses',
    price: 5499,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'],
    sizes: ['One Size'],
    colors: ['Gold/Green'],
    rating: 4.8,
    numReviews: 60,
    stock: 30,
    offer: true,
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
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
