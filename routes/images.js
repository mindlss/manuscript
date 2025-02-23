const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    uploadImage,
    getImages,
    removeImage,
} = require('../controllers/imageController');

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

router.post(
    '/upload',
    (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res
                    .status(400)
                    .json({
                        message: 'Error uploading file',
                        error: err.message,
                    });
            } else if (err) {
                return res
                    .status(500)
                    .json({
                        message: 'Internal server error',
                        error: err.message,
                    });
            }
            next();
        });
    },
    uploadImage
);

router.get('/', getImages);
router.delete('/:id', removeImage);

module.exports = router;
