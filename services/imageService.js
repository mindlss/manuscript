const { Image } = require('../models/imageModel');
const { getImagePath, deleteImageFile } = require('../utils/fileStorage');
const fs = require('fs');
const path = require('path');

// Сохранение изображения
const saveImage = async (file) => {
    const filePath = getImagePath(file.filename);
    const imageUrl = `/uploads/${file.filename}`;

    const image = new Image({
        name: file.originalname,
        url: imageUrl,
    });
    await image.save();

    return image;
};

// Получение всех изображений
const getAllImages = async () => {
    return await Image.find();
};

// Удаление изображения
const deleteImage = async (id) => {
    const image = await Image.findByIdAndDelete(id);
    if (image) {
        const filename = path.basename(image.url);
        deleteImageFile(filename);
    }
    return image;
};

module.exports = { saveImage, getAllImages, deleteImage };
