const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');   

const multer = require('multer');

module.exports = function() {
  const router = express.Router();

  // Configure multer for file uploads
  const upload = multer({
    dest: path.join(__dirname, 'public', 'uploads'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
       return cb(new Error('Please upload an image file(jpg, jpeg, png)'));
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

  // Route to get fashion data
  router.get('/ornaments', async (req, res) => {
    try {
      const filePath = path.join(__dirname, 'database', 'ornaments.json');
      const data = await fs.readFile(filePath, 'utf8');
      const ornaments = JSON.parse(data || '[]');
      res.json(ornaments);
    } catch (err) {
      console.error('Error reading fashion:', err);
      res.status(500).json({ message: 'Error reading fashion' });
    }
  });

  // POST route to receive form data and handle file uploads
  router.post('/save-ornaments-data', upload.single('photo'), async (req, res) => {
    const newData = {
      itemName: req.body.itemName,
      description: req.body.description,
      price: req.body.price,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber
    };

    const filePath = path.join(__dirname, 'database', 'ornaments.json');

    try {
      const data = await fs.readFile(filePath, 'utf8');
      let jsonData = JSON.parse(data);
      if (!Array.isArray(jsonData)) {
        jsonData = [];
      }
      jsonData.push(newData);

      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      res.redirect('/ornaments.html'); // Redirect to the grocery.html page
    } catch (err) {
      console.error('Error saving data:', err);
      res.status(500).json({ message: 'Error saving data' });
    }
  });

  return router;
};