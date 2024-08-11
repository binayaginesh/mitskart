const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// POST route to receive form data
app.post('/save-data', (req, res) => {
    const newData = {
        itemName: req.body.itemName,
        description: req.body.description,
        price: req.body.price,
        photo: req.body.photo, // You might need to handle file uploads separately
        name: req.body.name,
        phoneNumber: req.body.phoneNumber
    };

    // Path to grocery.json
    const filePath = path.join(__dirname, 'grocery.json');

    // Read the existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }

        // Parse the JSON data
        let jsonData = JSON.parse(data || '[]');
        jsonData.push(newData);

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing file' });
            }
            res.json({ message: 'Data saved successfully!' });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
