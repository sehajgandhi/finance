const express = require('express');
const axios = require('axios');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const Stock = require('../models/Stock');
const client = require('../config/db');

const router = express.Router();

// Get stock data
router.get('/', auth, async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add stock data
router.post(
    '/',
    [
        auth,
        [
            check('symbol', 'Stock symbol is required').not().isEmpty(),
            check('price', 'Stock price is required').isNumeric(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { symbol, price } = req.body;

        try {
            const newStock = new Stock({ symbol, price });
            const stock = await newStock.save();
            res.json(stock);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get real-time stock data from external API
router.get('/realtime/:symbol', auth, async (req, res) => {
    try {
        const response = await axios.get(`https://api.example.com/stock/${req.params.symbol}`);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
