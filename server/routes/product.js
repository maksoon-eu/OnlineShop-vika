const Product = require('../models/Product');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;

    try {
        const products = limit > 0 ? await Product.findAll({ limit }) : await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load product details' });
    }
});

module.exports = router;
