const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./data/database.sqlite');

router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).send('Error');
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });
});

module.exports = router;
