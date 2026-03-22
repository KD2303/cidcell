const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig');

// @route   POST api/upload
// @desc    Upload an image to Cloudinary
// @access  Private (though authentication should be handled by middleware)
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload Error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ url: req.file.path, public_id: req.file.filename });
  });
});

// For multiple images
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = req.files.map(file => ({ url: file.path, public_id: file.filename }));
    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during multiple upload' });
  }
});

module.exports = router;
