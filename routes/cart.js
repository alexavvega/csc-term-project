const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

function initCart(req) {
    if (!req.session.cart) {
        req.session.cart = [];
    }
}

router.get('/api', (req, res) => {
    initCart(req);
    res.json(req.session.cart);
});

router.post('/api/add', (req, res) => {
    const { productId, quantity } = req.body;
    initCart(req);

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) return res.status(400).json({ error: "Invalid product" });

        const existing = req.session.cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += parseInt(quantity);
        } else {
            req.session.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: parseInt(quantity)
            });
        }

        res.json({ message: "Added to cart", cart: req.session.cart });
    });
});

router.post('/api/update', (req, res) => {
    const { productId, quantity } = req.body;
    if (!req.session.cart) return res.json([]);

    req.session.cart = req.session.cart.map(item => {
        if (item.id == productId) {
            item.quantity = parseInt(quantity);
        }
        return item;
    });

    res.json(req.session.cart);
});


router.post('/api/checkout', (req, res) => {
    const { fullname, address, city, zip, cardname, cardnumber, expiry, cvc } = req.body;

    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({ error: "Cart is empty." });
    }

    // Log order for now (can be extended to save to DB)
    console.log("ORDER PLACED:");
    console.log("Customer:", fullname, address, city, zip);
    console.log("Payment:", cardname, cardnumber, expiry, cvc);
    console.log("Cart:", req.session.cart);

    // Clear cart
    req.session.cart = [];

    res.json({ success: true });
});



router.post('/api/remove', (req, res) => {
    const { productId } = req.body;
    if (!req.session.cart) return res.json([]);

    req.session.cart = req.session.cart.filter(item => item.id != productId);
    res.json(req.session.cart);
});

module.exports = router;
