const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `File process error: ${err.message}` });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided in request' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'techugrow',
      resource_type: 'auto',
    });

    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error('Cloudinary Route Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to upload image to Cloudinary' });
  }
});

module.exports = router;
