const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const RentalProduct = require('../models/RentalProduct');
const { sampleRentalProducts } = require('../controllers/rentalController');

dotenv.config();

const seedRentals = async () => {
  try {
    await connectDB();
    await RentalProduct.deleteMany();
    await RentalProduct.insertMany(sampleRentalProducts);
    console.log('✅ Successfully seeded 18 Luxury Rental Products into MongoDB with 3 stock units each!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rental data:', error);
    process.exit(1);
  }
};

seedRentals();
