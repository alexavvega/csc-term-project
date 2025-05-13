// Express Modual importation function
const express = require('express');

// Express Application
const app = express();
const port = 3000;

// to JSON bodies
app.use(express.json());
// to URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// serve static files from 'public' directory
app.use(express.static('public'));

// Defined route for the home page
app.get('/', (req, res) => {
  res.send('Test Express Server goes here.');  // Reroute if needed here for text display
});

// API route
app.get('/api/info', (req, res) => {
  res.json({
    serverName: 'My Express Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date()
  });
});

// endpoint 
app.post('/api/data', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);
  res.status(201).json({
    message: 'Data received successfully',
    data: data
  });
});

// Server function to start at local host
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});