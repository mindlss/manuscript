const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadImage, getImages, removeImage } = require('../controllers/imageController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);
router.get('/', getImages);
router.delete('/:id', removeImage);

module.exports = router;