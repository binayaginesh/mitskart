const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Import multer

const app = express();

// Configure multer for file uploads
const upload = multer({
    dest: path.join(__dirname, 'public', 'uploads'), // Directory to save uploaded files
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5 MB)
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from 'img' directory
app.use('/img', express.static(path.join(__dirname, 'Olx-Clone-main', 'img')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Catch-all route to serve HTML files
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'Olx-Clone-main', 'public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// POST route to receive form data and handle file uploads
app.post('/save-data', upload.single('photo'), (req, res) => {
    const newData = {
        itemName: req.body.itemName,
        description: req.body.description,
        price: req.body.price,
        photo: req.file ? `/uploads/${req.file.filename}` : null, // Use uploaded file path
        name: req.body.name,
        phoneNumber: req.body.phoneNumber
    };

    // Correct path to the JSON file
    const filePath = path.join(__dirname, 'database', 'grocery.json');

    // Read the existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err); // Log the error
            return res.status(500).json({ message: 'Error reading file' });
        }

        // Parse the JSON data
        let jsonData;
        try {
            jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) {
                jsonData = []; // Initialize as an array if the data is not an array
            }
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr); // Log the error
            return res.status(500).json({ message: 'Error parsing JSON' });
        }

        // Add new data to the array
        jsonData.push(newData);

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err); // Log the error
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
