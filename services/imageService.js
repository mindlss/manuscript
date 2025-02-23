const { Image } = require('../models/imageModel');
const { getImagePath, deleteImageFile } = require('../utils/fileStorage');
const fs = require('fs');
const path = require('path');

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

const getAllImages = async () => {
    return await Image.find();
};

const deleteImage = async (id) => {
    const image = await Image.findByIdAndDelete(id);
    if (image) {
        const filename = path.basename(image.url);
        deleteImageFile(filename);
    }
    return image;
};

module.exports = { saveImage, getAllImages, deleteImage };