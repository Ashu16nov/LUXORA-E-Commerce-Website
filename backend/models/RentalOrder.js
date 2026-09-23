const mongoose = require('mongoose');

const rentalOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  rentalProduct: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'RentalProduct',
  },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  brand: { type: String },
  size: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  rentPrice: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  shippingPrice: { type: Number, required: true, default: 150 },
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  paymentMethod: { type: String, default: 'Credit / Debit Card' },
  isPaid: { type: Boolean, required: true, default: true },
  paidAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Booked', 'Dispatched', 'Active', 'Return Requested', 'Returned', 'Cancelled'],
    default: 'Active',
  },
  depositRefundStatus: {
    type: String,
    enum: ['Pending', 'Refunded', 'Forfeited'],
    default: 'Pending',
  },
  returnedAt: { type: Date },
  emergencyRequest: { type: Boolean, default: false },
  trackingNumber: { type: String, default: () => 'LX-RENT-' + Math.floor(100000 + Math.random() * 900000) },
}, {
  timestamps: true,
});

const RentalOrder = mongoose.model('RentalOrder', rentalOrderSchema);

module.exports = RentalOrder;
