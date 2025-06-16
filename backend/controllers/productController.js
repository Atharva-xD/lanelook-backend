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
  // Validate incoming data
  const { error } = validation.validateProduct(req.body); // Assuming you have a validation function
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

const updateProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
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