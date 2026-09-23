const mongoose = require('mongoose');

const rentalProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, default: 'A premium luxury designer garment available for exclusive rental.' },
  category: { type: String, required: true }, // Wedding, Gala & Evening, Festival & Ethnic, Formal & Luxury Suits
  subCategory: { type: String }, // Lehenga, Tuxedo, Gown, Sherwani, Designer Suit, Saree
  gender: { type: String, required: true }, // Men, Women, Unisex
  dailyRate: { type: Number, required: true }, // Charge per day
  originalValue: { type: Number, required: true }, // Full retail value
  securityDeposit: { type: Number, required: true }, // Refundable security deposit
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stockUnits: { type: Number, required: true, default: 3 }, // 2-3 units kept in stock for multi-user renting
  emergencyBufferUnits: { type: Number, default: 1 }, // Reserved stock for express emergency rentals
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 12 },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const RentalProduct = mongoose.model('RentalProduct', rentalProductSchema);

module.exports = RentalProduct;
