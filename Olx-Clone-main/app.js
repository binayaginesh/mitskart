const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');
const groceryRoutes = require('./grocery.js'); // Import the grocery routes

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/database', express.static(path.join(__dirname, 'database')));

// Use the grocery routes for API routes
app.use('/api', groceryRoutes());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
