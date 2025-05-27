const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = 3000;

// ✅ Database connection
const db = new sqlite3.Database('./data/database.sqlite');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ✅ Static assets
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);

// ✅ Optional custom EJS route
app.get('/battleToads', (req, res) => {
  res.render('battleToads');
});

// ✅ Search route (partial match, case-insensitive)
app.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q) return res.redirect('/');

  const query = `%${q.toLowerCase()}%`;

  db.get(
    'SELECT id FROM products WHERE LOWER(name) LIKE ?',
    [query],
    (err, product) => {
      if (err || !product) {
        return res.send(`<p>No product found for "${q}"</p><a href="/">Back</a>`);
      }

      res.redirect(`/product/${product.id}`);
    }
  );
});

// ✅ Dynamic product details page
app.get('/product/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err || !product) {
      return res.status(404).send("Product not found.");
    }

    res.send(`
      <h1>${product.name}</h1>
      <p>Price: $${product.price}</p>
      <img src="${product.image}" width="200" />
      <p>${product.description || ''}</p>
      <a href="/">Back</a>
    `);
  });
});

// ✅ Static HTML page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/product.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/cart.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/register.html'));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
