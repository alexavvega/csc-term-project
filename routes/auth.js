const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Registration failed.");
    }

    req.session.userId = this.lastID;
    res.redirect('/');
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).send("Invalid login.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Incorrect password.");

    req.session.userId = user.id;
    res.redirect('/');
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
