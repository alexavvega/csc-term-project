const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Session & Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Database
const db = new sqlite3.Database('./data/database.sqlite');

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views'))); // for .html pages

// Auth middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Routes - API & HTML
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);

// Static HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views/about.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'views/cart.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views/register.html')));
app.get('/faq', (req, res) => res.sendFile(path.join(__dirname, 'views/faq.html')));
app.get('/profile', requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'views/profile.html')));

// Search route
app.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q) return res.send("<p>No search query provided.</p><a href='/'>Back</a>");
  const keyword = `%${q.toLowerCase()}%`;

  db.all("SELECT * FROM products WHERE LOWER(name) LIKE ?", [keyword], (err, rows) => {
    if (err) return res.status(500).send("Database error.");
    if (!rows.length) return res.send(`<p>No results for "${q}"</p><a href="/">Back</a>`);

    let html = `<h1>Search Results for "${q}"</h1><div>`;
    rows.forEach(p => {
      html += `
        <div style="margin-bottom:20px;">
          <h2>${p.name}</h2>
          <p>Price: $${p.price}</p>
          <a href="/product.html?id=${p.id}">View</a>
        </div>
      `;
    });
    html += `</div><a href="/">Back</a>`;
    res.send(html);
  });
});

// ✅ Profile API for dynamic JS loading
app.get('/api/user', (req, res) => {
  if (!req.session.userId) return res.json({ error: "Not logged in" });

  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) return res.json({ error: "User not found" });

    db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user.id], (err2, orders) => {
      if (err2) return res.json({ error: "Failed to load purchase history" });
      res.json({ user, orders });
    });
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
