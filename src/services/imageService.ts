import { Image } from '../models/imageModel.js';
import { deleteImageFile } from '../utils/fileStorage.js';
import path from 'path';
import { Express } from 'express';
import 'multer';

// Сохранение изображения
const saveImage = async (file: Express.Multer.File) => {
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
const deleteImage = async (id: string) => {
    const image = await Image.findByIdAndDelete(id);
    if (image) {
        const filename = path.basename(image.url);
        deleteImageFile(filename);
    }
    return image;
};

export { saveImage, getAllImages, deleteImage };
