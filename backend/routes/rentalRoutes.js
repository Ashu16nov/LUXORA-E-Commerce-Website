const express = require('express');
const router = express.Router();
const {
  getRentalProducts,
  getRentalProductById,
  createRentalOrder,
  getMyRentals,
  returnRentalOrder,
  seedRentalProducts
} = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/products', getRentalProducts);
router.get('/products/:id', getRentalProductById);
router.post('/book', protect, createRentalOrder);
router.get('/my-rentals', protect, getMyRentals);
router.put('/:id/return', protect, returnRentalOrder);
router.get('/seed', seedRentalProducts);

module.exports = router;
