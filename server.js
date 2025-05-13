const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const gamesRoutes = require('./routes/games');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/games', gamesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));