const Product = require('../models/Product');

// @desc    Fetch all products with filtering, searching, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, size, search, sort, page: pageQuery } = req.query;

    const pageSize = req.query.limit ? Number(req.query.limit) : 10;
    const page = Number(pageQuery) || 1;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (size) {
      query.sizes = { $in: [size] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption.price = 1;
        break;
      case 'price_desc':
        sortOption.price = -1;
        break;
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'highest_rated':
        sortOption.rating = -1;
        break;
      case 'biggest_discount':
        sortOption.discount = -1;
        break;
      default:
        sortOption.featured = -1;
        break;
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      discount,
      brand,
      category,
      subCategory,
      stock,
      description,
      images,
      sizes,
      trending,
      offer
    } = req.body;

    const product = new Product({
      name: name || 'Sample Product Name',
      price: price || 0,
      originalPrice: originalPrice || 0,
      discount: discount || 0,
      brand: brand || 'LUXORA',
      category: category || 'Men',
      subCategory: subCategory || 'Apparel',
      stock: stock || 10,
      description: description || 'Luxora designer piece',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      trending: trending || false,
      offer: offer || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating product' });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      product.originalPrice = req.body.originalPrice ?? product.originalPrice;
      product.discount = req.body.discount ?? product.discount;
      product.brand = req.body.brand ?? product.brand;
      product.category = req.body.category ?? product.category;
      product.subCategory = req.body.subCategory ?? product.subCategory;
      product.stock = req.body.stock ?? product.stock;
      product.description = req.body.description ?? product.description;
      if (req.body.images) product.images = req.body.images;
      if (req.body.sizes) product.sizes = req.body.sizes;
      if (req.body.trending !== undefined) product.trending = req.body.trending;
      if (req.body.offer !== undefined) product.offer = req.body.offer;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating product' });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct
};
