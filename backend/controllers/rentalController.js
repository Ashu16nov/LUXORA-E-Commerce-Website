const RentalProduct = require('../models/RentalProduct');
const RentalOrder = require('../models/RentalOrder');

// @desc    Get all rental products with filtering & searching
// @route   GET /api/rentals/products
// @access  Public
const getRentalProducts = async (req, res) => {
  try {
    const { category, gender, size, search, sort, minRate, maxRate } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.gender = gender;
    }

    if (size) {
      query.sizes = { $in: [size] };
    }

    if (minRate || maxRate) {
      query.dailyRate = {};
      if (minRate) query.dailyRate.$gte = Number(minRate);
      if (maxRate) query.dailyRate.$lte = Number(maxRate);
    }

    let sortOption = {};
    if (sort === 'rate_asc') sortOption.dailyRate = 1;
    else if (sort === 'rate_desc') sortOption.dailyRate = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.featured = -1;

    const products = await RentalProduct.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    console.error('Error fetching rental products:', error);
    res.status(500).json({ message: 'Server error fetching rental products' });
  }
};

// @desc    Get single rental product with availability check
// @route   GET /api/rentals/products/:id
// @access  Public
const getRentalProductById = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const product = await RentalProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Rental garment not found' });
    }

    let activeBookingsCount = 0;

    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      activeBookingsCount = await RentalOrder.countDocuments({
        rentalProduct: product._id,
        status: { $in: ['Booked', 'Dispatched', 'Active', 'Return Requested'] },
        $or: [
          { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
        ]
      });
    }

    const availableUnits = Math.max(0, product.stockUnits - activeBookingsCount);

    res.json({
      product,
      stockUnitsTotal: product.stockUnits,
      activeBookingsCount,
      availableUnits,
      isAvailable: availableUnits > 0
    });
  } catch (error) {
    console.error('Error fetching rental product details:', error);
    res.status(500).json({ message: 'Server error fetching rental product' });
  }
};

// @desc    Create a new rental booking
// @route   POST /api/rentals/book
// @access  Private
const createRentalOrder = async (req, res) => {
  try {
    const {
      rentalProductId,
      size,
      startDate,
      endDate,
      shippingAddress,
      paymentMethod,
      emergencyRequest
    } = req.body;

    if (!rentalProductId || !startDate || !endDate || !size) {
      return res.status(400).json({ message: 'Please provide all required rental booking details' });
    }

    const product = await RentalProduct.findById(rentalProductId);
    if (!product) {
      return res.status(404).json({ message: 'Rental garment not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    // Calculate total days (min 1 day)
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check availability for this timeframe against stock of 3 units
    const activeBookingsCount = await RentalOrder.countDocuments({
      rentalProduct: product._id,
      status: { $in: ['Booked', 'Dispatched', 'Active', 'Return Requested'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (activeBookingsCount >= product.stockUnits) {
      return res.status(400).json({
        message: `All ${product.stockUnits} units of this outfit are already rented out for the selected dates. Please pick another date range or garment.`
      });
    }

    const rentPrice = totalDays * product.dailyRate;
    const securityDeposit = product.securityDeposit;
    const shippingPrice = emergencyRequest ? 300 : 150; // Express emergency shipping fee
    const totalPrice = rentPrice + securityDeposit + shippingPrice;

    const rentalOrder = new RentalOrder({
      user: req.user._id,
      rentalProduct: product._id,
      productName: product.name,
      productImage: product.images[0],
      brand: product.brand,
      size,
      startDate: start,
      endDate: end,
      totalDays,
      dailyRate: product.dailyRate,
      rentPrice,
      securityDeposit,
      shippingPrice,
      totalPrice,
      shippingAddress: shippingAddress || req.user.address || {},
      paymentMethod: paymentMethod || 'Credit / Debit Card',
      emergencyRequest: Boolean(emergencyRequest),
      status: 'Active',
      depositRefundStatus: 'Pending',
    });

    const createdOrder = await rentalOrder.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating rental order:', error);
    res.status(500).json({ message: error.message || 'Server error processing rental booking' });
  }
};

// @desc    Get logged in user's rental orders
// @route   GET /api/rentals/my-rentals
// @access  Private
const getMyRentals = async (req, res) => {
  try {
    const rentals = await RentalOrder.find({ user: req.user._id })
      .populate('rentalProduct')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ message: 'Server error fetching user rentals' });
  }
};

// @desc    Return rented garment back to website stock
// @route   PUT /api/rentals/:id/return
// @access  Private
const returnRentalOrder = async (req, res) => {
  try {
    const rentalOrder = await RentalOrder.findById(req.params.id);

    if (!rentalOrder) {
      return res.status(404).json({ message: 'Rental order not found' });
    }

    // Ensure user owns this rental order or is admin
    if (rentalOrder.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to perform return on this rental' });
    }

    if (rentalOrder.status === 'Returned') {
      return res.status(400).json({ message: 'This rental has already been returned' });
    }

    rentalOrder.status = 'Returned';
    rentalOrder.depositRefundStatus = 'Refunded';
    rentalOrder.returnedAt = new Date();

    await rentalOrder.save();

    res.json({
      message: 'Garment successfully returned back to Luxora inventory! Security deposit refunded to original payment method.',
      rentalOrder
    });
  } catch (error) {
    console.error('Error returning rental:', error);
    res.status(500).json({ message: 'Server error processing garment return' });
  }
};

// Seed sample luxury rental items
const sampleRentalProducts = [
  {
    name: 'Royal Velvet Tuxedo',
    brand: 'LUXORA Privé',
    description: 'Bespoke deep navy royal velvet tuxedo featuring satin lapels and handcrafted silk lining. Perfect for black-tie galas and weddings.',
    category: 'Formal & Luxury Suits',
    subCategory: 'Tuxedo',
    gender: 'Men',
    dailyRate: 899,
    originalValue: 45000,
    securityDeposit: 2500,
    images: ['https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800&q=80'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Royal Navy', 'Midnight Black'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 28,
    featured: true,
    trending: true
  },
  {
    name: 'Embroidered Bridal Lehenga Gown',
    brand: 'Sabyasachi Heritage',
    description: 'Exquisite crimson red bridal lehenga richly embellished with gold zari work, sequin embroidery, and dual dupatta.',
    category: 'Wedding',
    subCategory: 'Lehenga',
    gender: 'Women',
    dailyRate: 1499,
    originalValue: 95000,
    securityDeposit: 4000,
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: ['Crimson Red', 'Royal Gold'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 5.0,
    numReviews: 35,
    featured: true,
    trending: true
  },
  {
    name: 'Emerald Silk Evening Gown',
    brand: 'Manish Malhotra',
    description: 'Floor-sweeping emerald green silk satin evening gown with asymmetric cape drape and hand-embroidered waist accent.',
    category: 'Gala & Evening',
    subCategory: 'Gown',
    gender: 'Women',
    dailyRate: 999,
    originalValue: 52000,
    securityDeposit: 3000,
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald Green'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.8,
    numReviews: 19,
    featured: true,
    trending: false
  },
  {
    name: 'Raw Silk Groom Sherwani Set',
    brand: 'Tarun Tahiliani',
    description: 'Opulent ivory raw silk sherwani set complete with handcrafted stole, churidar, and embellished turban brooch.',
    category: 'Wedding',
    subCategory: 'Sherwani',
    gender: 'Men',
    dailyRate: 1299,
    originalValue: 78000,
    securityDeposit: 3500,
    images: ['https://images.unsplash.com/photo-1589756804153-61a0ed27b407?w=800&q=80'],
    sizes: ['38', '40', '42'],
    colors: ['Ivory Gold'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 24,
    featured: true,
    trending: true
  },
  {
    name: 'Rose Gold Banarasi Silk Saree',
    brand: 'LUXORA Couture',
    description: 'Authentic handwoven Banarasi pure silk saree with real silver zari embroidery and stitched matching blouse.',
    category: 'Festival & Ethnic',
    subCategory: 'Saree',
    gender: 'Women',
    dailyRate: 699,
    originalValue: 38000,
    securityDeposit: 2000,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'],
    sizes: ['Free Size'],
    colors: ['Rose Gold'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.7,
    numReviews: 16,
    featured: false,
    trending: true
  },
  {
    name: 'Italian Wool Double-Breasted Suit',
    brand: 'Armani Collezioni',
    description: 'Sharp Italian wool double-breasted suit in charcoal grey. Engineered for executive galas and high-profile events.',
    category: 'Formal & Luxury Suits',
    subCategory: 'Designer Suit',
    gender: 'Men',
    dailyRate: 799,
    originalValue: 42000,
    securityDeposit: 2200,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Charcoal Grey'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.8,
    numReviews: 22,
    featured: false,
    trending: true
  }
];

const seedRentalProducts = async (req, res) => {
  try {
    await RentalProduct.deleteMany();
    await RentalProduct.insertMany(sampleRentalProducts);
    res.json({ message: 'Rental products seeded successfully with 3 stock units each!' });
  } catch (error) {
    console.error('Error seeding rental products:', error);
    res.status(500).json({ message: 'Error seeding rental products' });
  }
};

module.exports = {
  getRentalProducts,
  getRentalProductById,
  createRentalOrder,
  getMyRentals,
  returnRentalOrder,
  seedRentalProducts,
  sampleRentalProducts
};
