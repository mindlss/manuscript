const {
    saveImage,
    getAllImages,
    deleteImage,
} = require('../services/imageService');

// Загрузить изображение
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File is not uploaded' });
        }

        const image = await saveImage(req.file);
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({
            message: 'Error uploading file',
            error: error.message,
        });
    }
};

// Получить изображения
const getImages = async (req, res) => {
    try {
        const images = await getAllImages();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({
            message: 'Error getting images',
            error: error.message,
        });
    }
};

// Удалить изображение
const removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await deleteImage(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting image',
            error: error.message,
        });
    }
};

module.exports = { uploadImage, getImages, removeImage };
