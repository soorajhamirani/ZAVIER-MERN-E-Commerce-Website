const Product = require('../models/Product');

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, size, search, limit, page, gender, season, maxPrice } = req.query;

    const query = {};

    // Filter by Category (supports comma-separated list)
    if (category && category !== 'all') {
      query.categories = { $in: category.toLowerCase().split(',') };
    }

    // Filter by Gender
    if (gender) {
      query.gender = { $in: gender.split(',') };
    }

    // Filter by Season
    if (season) {
      const parsedSeasons = season.split(',').map(s => {
        if (s.toLowerCase().includes('winter')) return 'Winter';
        if (s.toLowerCase().includes('summer')) return 'Summer';
        return s;
      });
      query.season = { $in: parsedSeasons };
    }

    // Filter by maxPrice (PKR base numbers)
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Filter by Size availability
    if (size) {
      query['variants.size'] = size.toUpperCase();
      query['variants.stockCount'] = { $gt: 0 };
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageSize = parseInt(limit) || 12;
    const pageNum = parseInt(page) || 1;
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(pageSize * (pageNum - 1))
      .limit(pageSize);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single product
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { title, description, price, categories, images, variants } = req.body;

  try {
    const product = new Product({
      title,
      description,
      price,
      categories: categories.map(cat => cat.trim().toLowerCase()),
      images,
      variants: variants || []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product details/variants/pricing
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { title, description, price, categories, images, variants } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      if (categories) {
        product.categories = categories.map(cat => cat.trim().toLowerCase());
      }
      product.images = images || product.images;
      product.variants = variants || product.variants;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
