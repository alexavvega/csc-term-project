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


// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
