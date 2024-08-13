const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

module.exports = function() {
    console.log('Grocery function called');
    const router = express.Router();

    // Configure multer for file uploads
    const upload = multer({
        dest: path.join(__dirname, 'public', 'uploads'), // Directory to save uploaded files
        limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
            }
            cb(null, true);
        }
    });

    // Middleware to parse JSON data
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    // Serve static files
    router.use(express.static(path.join(__dirname, 'public')));
    router.use('/img', express.static(path.join(__dirname, 'img')));
    router.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
    router.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
    router.use('/database', express.static(path.join(__dirname, 'database')));

    // Route to get grocery data
    router.get('/api/groceries', (req, res) => {
        console.log('GET /api/groceries route hit'); // Debug statement
        const filePath = path.join(__dirname, 'database', 'grocery.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).json({ message: 'Error reading file' });
            }
            console.log('Data read from file:', data); 
            res.json(JSON.parse(data || '[]'));
        });
    });

    // POST route to receive form data and handle file uploads
    router.post('/save-data', upload.single('photo'), (req, res) => {
        const newData = {
            itemName: req.body.itemName,
            description: req.body.description,
            price: req.body.price,
            photo: req.file ? `/uploads/${req.file.filename}` : null,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber
        };

        const filePath = path.join(__dirname, 'database', 'grocery.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).json({ message: 'Error reading file' });
            }

            let jsonData;
            try {
                jsonData = JSON.parse(data);
                if (!Array.isArray(jsonData)) {
                    jsonData = [];
                }
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).json({ message: 'Error parsing JSON' });
            }

            jsonData.push(newData);

            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ message: 'Error writing file' });
                }
                res.redirect('/grocery.html'); // Redirect to the grocery.html page
            });
        });
    });

    return router;
};
