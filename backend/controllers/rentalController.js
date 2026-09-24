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

// Seed sample luxury rental items (18 detailed fashion e-commerce items)
const sampleRentalProducts = [
  {
    name: 'Royal Velvet Tuxedo',
    brand: 'LUXORA Privé',
    description: 'Bespoke deep navy royal velvet tuxedo featuring satin lapels and handcrafted silk lining. Engineered with precision tailoring for black-tie galas, high-society balls, and award ceremonies.',
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
    description: 'Exquisite crimson red bridal lehenga richly embellished with gold zari work, hand-stitched sequin embroidery, and dual net dupatta. Designed for royal weddings and grand celebrations.',
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
    description: 'Floor-sweeping emerald green silk satin evening gown with asymmetric cape drape and hand-embroidered waist accent. Perfectly styled for red carpet galas and engagement parties.',
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
    description: 'Opulent ivory raw silk sherwani set complete with handcrafted stole, churidar, and embellished turban brooch. Features antique zardozi work and pearl motif embroidery.',
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
    description: 'Authentic handwoven Banarasi pure silk saree with real silver zari embroidery and stitched matching blouse. Ideal for festive receptions, sangeets, and traditional galas.',
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
    description: 'Sharp Italian wool double-breasted suit in charcoal grey. Crafted with horn buttons and peak lapels for executive galas and high-profile corporate events.',
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
  },
  {
    name: 'Royal Heritage Kundan Choker Set',
    brand: 'Sabyasachi Fine Jewelry',
    description: 'Masterpiece uncut Kundan and emerald drop choker necklace set with matching chandelier earrings. Handcrafted in 22k gold plating for grand wedding galas.',
    category: 'Accessories',
    subCategory: 'Jewelry',
    gender: 'Women',
    dailyRate: 2499,
    originalValue: 150000,
    securityDeposit: 5000,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
    sizes: ['One Size'],
    colors: ['Gold & Emerald'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 5.0,
    numReviews: 12,
    featured: true,
    trending: true
  },
  {
    name: 'Rolex Oyster Perpetual Datejust Watch',
    brand: 'Rolex',
    description: 'Iconic 41mm Oystersteel and yellow gold Datejust timepiece featuring champagne dial and Jubilee bracelet. The ultimate statement accessory for elite occasions.',
    category: 'Accessories',
    subCategory: 'Watches',
    gender: 'Unisex',
    dailyRate: 3999,
    originalValue: 650000,
    securityDeposit: 10000,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'],
    sizes: ['One Size'],
    colors: ['Gold & Steel'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 5.0,
    numReviews: 42,
    featured: true,
    trending: true
  },
  {
    name: 'Gucci Dionysus Embellished Shoulder Bag',
    brand: 'Gucci',
    description: 'Structured GG Supreme canvas shoulder bag with textured tiger head closure and Swarovski crystal details. Comes with sliding chain strap.',
    category: 'Accessories',
    subCategory: 'Bags',
    gender: 'Women',
    dailyRate: 1799,
    originalValue: 180000,
    securityDeposit: 4000,
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'],
    sizes: ['One Size'],
    colors: ['Beige & Ebony'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 18,
    featured: true,
    trending: false
  },
  {
    name: 'Emerald Silk Floor-Length Anarkali',
    brand: 'Anita Dongre',
    description: 'Chanderi silk floor-length Anarkali suit with gota patti embroidery and organza dupatta. Elegant choice for sangeet nights and reception banquets.',
    category: 'Festival & Ethnic',
    subCategory: 'Anarkali',
    gender: 'Women',
    dailyRate: 899,
    originalValue: 48000,
    securityDeposit: 2200,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bottle Green'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.8,
    numReviews: 15,
    featured: false,
    trending: true
  },
  {
    name: 'Tom Ford Black Shawl Collar Tuxedo',
    brand: 'Tom Ford',
    description: 'Timeless black wool tuxedo tailored with silk satin shawl collar and single-button closure. Signature Italian cut for unforgettable black-tie appearances.',
    category: 'Formal & Luxury Suits',
    subCategory: 'Tuxedo',
    gender: 'Men',
    dailyRate: 1199,
    originalValue: 60000,
    securityDeposit: 3000,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Classic Black'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 29,
    featured: true,
    trending: true
  },
  {
    name: 'Elie Saab Crystal Promenade Gown',
    brand: 'Elie Saab',
    description: 'Haute couture midnight blue gown embellished with hand-sewn crystals, sheer neckline, and cascading train. Guaranteed head-turner at high fashion galas.',
    category: 'Gala & Evening',
    subCategory: 'Gown',
    gender: 'Women',
    dailyRate: 1599,
    originalValue: 88000,
    securityDeposit: 4000,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'],
    sizes: ['S', 'M'],
    colors: ['Midnight Blue'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 5.0,
    numReviews: 14,
    featured: true,
    trending: true
  },
  {
    name: 'Jimmy Choo Crystal Embellished Pumps',
    brand: 'Jimmy Choo',
    description: 'Sparkling point-toe pumps covered in light-catching crystals with 100mm stiletto heel. Includes protective leather sole lining.',
    category: 'Accessories',
    subCategory: 'Shoes',
    gender: 'Women',
    dailyRate: 1299,
    originalValue: 95000,
    securityDeposit: 3000,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
    sizes: ['36', '37', '38', '39'],
    colors: ['Silver Crystal'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.8,
    numReviews: 20,
    featured: false,
    trending: true
  },
  {
    name: 'Mirror Work Indo-Western Kurta Set',
    brand: 'Abhinav Mishra',
    description: 'Vibrant pastel yellow silk Indo-Western asymmetric kurta set adorned with signature abla mirror work and tailored trousers.',
    category: 'Festival & Ethnic',
    subCategory: 'Indo-Western',
    gender: 'Men',
    dailyRate: 699,
    originalValue: 38000,
    securityDeposit: 1800,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'],
    sizes: ['38', '40', '42'],
    colors: ['Pastel Yellow'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.7,
    numReviews: 11,
    featured: false,
    trending: true
  },
  {
    name: 'Chanel Classic Flap Lambskin Bag',
    brand: 'Chanel',
    description: 'Timeless quilted black lambskin leather handbag with gold-tone hardware and iconic CC turn-lock closure. The epitome of luxury fashion.',
    category: 'Accessories',
    subCategory: 'Bags',
    gender: 'Women',
    dailyRate: 2999,
    originalValue: 320000,
    securityDeposit: 7500,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
    sizes: ['Medium'],
    colors: ['Black Gold'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 5.0,
    numReviews: 31,
    featured: true,
    trending: true
  },
  {
    name: 'Nizam Royal Pearl & Ruby Bridal Set',
    brand: 'Marwar Jewels',
    description: 'Heritage Nizam era inspired multi-strand basra pearl necklace set with hand-cut rubies and emerald drops. Crafted for high royal weddings.',
    category: 'Accessories',
    subCategory: 'Jewelry',
    gender: 'Women',
    dailyRate: 1999,
    originalValue: 110000,
    securityDeposit: 4500,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    sizes: ['Free Size'],
    colors: ['Pearl & Ruby'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 9,
    featured: false,
    trending: false
  },
  {
    name: 'Louboutin Patent Leather Oxfords',
    brand: 'Christian Louboutin',
    description: 'High-shine black patent leather formal lace-up Oxfords with iconic signature red lacquered sole. Expertly crafted in Italy.',
    category: 'Accessories',
    subCategory: 'Shoes',
    gender: 'Men',
    dailyRate: 899,
    originalValue: 65000,
    securityDeposit: 2000,
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80'],
    sizes: ['8', '9', '10', '11'],
    colors: ['Glossy Black'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.8,
    numReviews: 23,
    featured: false,
    trending: true
  },
  {
    name: 'Royal Kanjivaram Pure Gold Zari Saree',
    brand: 'Kanjivaram Heritage',
    description: 'Traditional heavy Kanchipuram silk saree woven with pure gold zari temple borders and rich pallu. Paired with unstitched matching blouse piece.',
    category: 'Festival & Ethnic',
    subCategory: 'Saree',
    gender: 'Women',
    dailyRate: 999,
    originalValue: 55000,
    securityDeposit: 2500,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
    sizes: ['Free Size'],
    colors: ['Deep Magenta & Gold'],
    stockUnits: 3,
    emergencyBufferUnits: 1,
    rating: 4.9,
    numReviews: 18,
    featured: true,
    trending: true
  }
];

const seedRentalProducts = async (req, res) => {
  try {
    await RentalProduct.deleteMany();
    await RentalProduct.insertMany(sampleRentalProducts);
    res.json({ message: 'Seeded 18 Luxury Rental Products into MongoDB with 3 stock units each!' });
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
