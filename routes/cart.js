const express = require('express');
const router = express.Router();
let cart = [];

router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  cart.push({ productId, quantity });
  res.json(cart);
});

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/checkout', (req, res) => {
  cart = [];
  res.json({ message: 'Checkout complete' });
});

module.exports = router;
