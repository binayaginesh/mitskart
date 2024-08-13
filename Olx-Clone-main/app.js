const express = require('express');
const grocery = require('./grocery');
const groceryRouter = require('./grocery')()
/*const fashion = require('./fashion'); // Comment out until file is created
const handbag = require('./handbag'); // Comment out until file is created
const login = require('./scripts/login'); // Ensure this module exports a function if used*/

console.log('Grocery module loaded');


const groceryRouter = require('./grocery'); 
const app = express();

app.use('/grocery', grocery());

// app.use('/fashion', fashion()); // Uncomment when fashion.js is created

// Set up your routes and server configurations here

app.use(express.static('public')); // Adjust if your static files are in a different directory

// Default route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the MITSKART!');
});

// Handle 404 errors (optional)
app.use((req, res, next) => {
    res.status(404).send('Sorry, we could not find that!');
});

app.use('/api', groceryRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
