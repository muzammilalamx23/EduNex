const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const communityController = require('../controllers/communityController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'edunex_community',
        allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    },
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 2 * 1024 * 1024 } // ~2MB
});

// GET messages
router.get('/', auth, communityController.getMessages);

// POST text message
router.post('/', auth, communityController.sendMessage);

// POST image message
router.post('/image', auth, upload.single('image'), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File too large. Max size is 2MB.' });
        }
    } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
}, communityController.uploadImage);

// DELETE message
router.delete('/:msgId', auth, communityController.deleteMessage);

// PATCH moderate image
router.patch('/:msgId/moderate', auth, communityController.moderateImage);

module.exports = router;
