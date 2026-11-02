const express = require('express');
const Product = require('../models/Product');
const { auth, requireRole } = require('../middleware/auth');
const triggerSeoRebuild = require('../utils/seoRebuild');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, condition, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (condition && condition !== 'All') {
      query.condition = condition;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (admin/merchant only)
router.post('/', auth, requireRole(['admin', 'merchant']), async (req, res) => {
  try {
    const { title, description, price, image, images, category, condition, stock, featured } = req.body;

    const product = new Product({
      title,
      description,
      price,
      image,
      images: images || [],
      category,
      condition,
      stock: stock || 0,
      featured: featured || false,
      createdBy: req.user._id
    });

    await product.save();
    await product.populate('createdBy', 'name email');
    await triggerSeoRebuild();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (admin/merchant only)
router.put('/:id', auth, requireRole(['admin', 'merchant']), async (req, res) => {
  try {
    const { title, description, price, image, images, category, condition, stock, featured } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.images = images !== undefined ? images : product.images;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.stock = stock !== undefined ? stock : product.stock;
    product.featured = featured !== undefined ? featured : product.featured;

    await product.save();
    await product.populate('createdBy', 'name email');
    await triggerSeoRebuild();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (admin/merchant only)
router.delete('/:id', auth, requireRole(['admin', 'merchant']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await triggerSeoRebuild();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Get categories (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
