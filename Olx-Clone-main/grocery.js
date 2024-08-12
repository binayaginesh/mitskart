const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/database', express.static(path.join(__dirname, 'database')));

// Route to get grocery data
app.get('/api/groceries', (req, res) => {
    const filePath = path.join(__dirname, 'database', 'grocery.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// POST route to receive form data and handle file uploads
app.post('/save-data', upload.single('photo'), (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
