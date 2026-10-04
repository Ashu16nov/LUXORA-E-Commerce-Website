const Product = require('../models/Product');
const RentalProduct = require('../models/RentalProduct');
const Order = require('../models/Order');
const RentalOrder = require('../models/RentalOrder');
const User = require('../models/User');

// @desc    Get complete dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalRentals,
      totalOrders,
      totalRentalOrders,
      totalUsers,
      retailRevenueData,
      rentalRevenueData,
      lowStockProducts,
      lowStockRentals,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      RentalProduct.countDocuments(),
      Order.countDocuments(),
      RentalOrder.countDocuments(),
      User.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      RentalOrder.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Product.find({ stock: { $lt: 5 } }).select('name stock images'),
      RentalProduct.find({ stockUnits: { $lt: 2 } }).select('name stockUnits images'),
      Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name')
    ]);

    const retailRev = retailRevenueData.length > 0 ? retailRevenueData[0].total : 0;
    const rentalRev = rentalRevenueData.length > 0 ? rentalRevenueData[0].total : 0;

    res.json({
      totalProducts,
      totalRentals,
      totalOrders: totalOrders + totalRentalOrders,
      totalUsers,
      totalRevenue: retailRev + rentalRev,
      lowStockProducts,
      lowStockRentals,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error compiling dashboard stats' });
  }
};

module.exports = {
  getDashboardStats
};
