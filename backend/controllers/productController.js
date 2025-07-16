// backend/controllers/productController.js
const Product = require('../models/Product');
const asyncMiddleware = require('../utils/asyncMiddleware');
const validation = require('../utils/validation');

const getProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate('brand');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

const getProducts = asyncMiddleware(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

const addProduct = asyncMiddleware(async (req, res) => {
  try {
    validation.validateProduct(req.body); // Throws error if invalid
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Product added successfully',
      data: product
    });
  } catch (err) {
    // Duplicate key error (unique constraint)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.productId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Product ID must be unique.',
        details: null
      });
    }
    // Validation errors
    if (err.message && err.message.includes('required')) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: err.message,
        details: null
      });
    }
    // Other errors
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'An unexpected error occurred.',
      details: err.errors || null
    });
  }
});

const updateProduct = asyncMiddleware(async (req, res) => {
  try {
    // Optionally validate fields here if you want strict validation on update
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Product not found.',
        details: null
      });
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    // Duplicate key error (unique constraint)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.productId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Product ID must be unique.',
        details: null
      });
    }
    // Validation errors
    if (err.message && err.message.includes('required')) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: err.message,
        details: null
      });
    }
    // Other errors
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'An unexpected error occurred.',
      details: err.errors || null
    });
  }
});

const deleteProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(204).json({ message: 'Product deleted successfully' });
});

module.exports = {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};