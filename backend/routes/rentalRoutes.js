const express = require('express');
const router = express.Router();
const {
  getRentalProducts,
  getRentalProductById,
  createRentalOrder,
  getMyRentals,
  returnRentalOrder,
  seedRentalProducts,
  createRentalProduct,
  updateRentalProduct,
  deleteRentalProduct,
  getAllRentalOrders
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/products', getRentalProducts);
router.post('/products', protect, admin, createRentalProduct);
router.get('/products/:id', getRentalProductById);
router.put('/products/:id', protect, admin, updateRentalProduct);
router.delete('/products/:id', protect, admin, deleteRentalProduct);

router.post('/book', protect, createRentalOrder);
router.get('/my-rentals', protect, getMyRentals);
router.put('/:id/return', protect, returnRentalOrder);
router.get('/seed', seedRentalProducts);

router.get('/admin/all-orders', protect, admin, getAllRentalOrders);

module.exports = router;
