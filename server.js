const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ✅ Serve static files (including .html)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views'))); // So /product.html works directly

// ✅ Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);  // <== products API route
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);

// ✅ HTML Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/cart.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/profile.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/faq.html'));
});


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

app.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q) return res.send("<p>No search query provided.</p><a href='/'>Back</a>");

  const keyword = `%${q.toLowerCase()}%`;

  db.all(
    "SELECT * FROM products WHERE LOWER(name) LIKE ?",
    [keyword],
    (err, rows) => {
      if (err) return res.status(500).send("Database error.");
      if (!rows.length) return res.send(`<p>No results for "${q}"</p><a href="/">Back</a>`);

      // Send a very simple result page for now
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
    }
  );
});



// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
