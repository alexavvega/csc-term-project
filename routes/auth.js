const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./data/database.sqlite');

// ✅ Ensure users table exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error("❌ Error creating users table:", err.message);
});

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering user:", name, email);

  if (!name || !email || !password) {
    return res.status(400).send("Missing name, email or password.");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).send("⚠️ Email already in use.");
          }
          console.error("❌ Registration DB error:", err.message);
          return res.status(500).send("Registration failed.");
        }

        req.session.userId = this.lastID;
        console.log("✅ Registered user ID:", this.lastID);
        res.redirect('/');
      }
    );
  } catch (err) {
    console.error("❌ Hashing error:", err.message);
    res.status(500).send("Internal server error.");
  }
});

// ✅ LOGIN
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

// ✅ LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});


module.exports = router;
