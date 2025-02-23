const { saveImage, getAllImages, deleteImage } = require('../services/imageService');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не загружен' });
        }
        
        const image = await saveImage(req.file);
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка загрузки', error: error.message });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await getAllImages();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения изображений', error: error.message });
    }
};

const removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await deleteImage(id);
        if (!image) {
            return res.status(404).json({ message: 'Изображение не найдено' });
        }
        res.status(200).json({ message: 'Изображение удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления', error: error.message });
    }
};

module.exports = { uploadImage, getImages, removeImage };
