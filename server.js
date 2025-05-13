const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // for form data
app.use(session({
  secret: 'keyboard cat', // Change in production!
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true only with HTTPS
}));

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/home.html')));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));

app.post('/login', (req, res) => {
  const username = req.body.username;
  if (username) {
    req.session.username = username;
    res.redirect('/secret');
  } else {
    res.send('Please enter a username');
  }
});

app.get('/secret', (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, 'views/secret.html'));
  } else {
    res.redirect('/login');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
