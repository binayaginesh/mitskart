const express = require('express');
const bodyParser = require('body-parser');
const groceryRoutes = require('./grocery'); // Import the grocery routes

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Use the grocery routes for API routes
app.use('/api', groceryRoutes());

// You can add other routes and configurations here if needed
// For example, if you have other routes:
// app.use('/fashion', fashionRoutes());
// app.use('/handbag', handbagRoutes());
// app.use('/login', loginRoutes());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
