const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./data/database.sqlite');

router.get('/profile', (req, res) => {
  if (!req.session.userId) return res.redirect('/auth/login');
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) return res.redirect('/auth/login');
    res.sendFile(path.join(__dirname, '../views/user.html'));
  });
});

module.exports = router;
