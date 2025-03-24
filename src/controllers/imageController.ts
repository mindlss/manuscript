import { Request, Response } from 'express';
import { saveImage, getAllImages, deleteImage } from '@services/imageService';
import { logger } from '@utils/logger';

class ImageController {
    // Загрузить изображение
    async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                logger.warn('File is not uploaded');
                res.status(400).json({ message: 'File is not uploaded' });
                return;
            }

            logger.info(`Uploading image: ${req.file.originalname}`);
            const image = await saveImage(req.file);
            res.status(201).json(image);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error uploading file: ${error.message}`);
                res.status(500).json({
                    message: 'Error uploading file',
                    error: error.message,
                });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    // Получить изображения
    async getImages(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Fetching all images');
            const images = await getAllImages();
            res.status(200).json(images);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error getting images: ${error.message}`);
                res.status(500).json({
                    message: 'Error getting images',
                    error: error.message,
                });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    // Удалить изображение
    async removeImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`Deleting image with ID: ${id}`);

            const image = await deleteImage(id);
            if (!image) {
                logger.warn(`Image with ID ${id} not found`);
                res.status(404).json({ message: 'Image not found' });
                return;
            }

            res.status(200).json({ message: 'Image deleted' });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error deleting image: ${error.message}`);
                res.status(500).json({
                    message: 'Error deleting image',
                    error: error.message,
                });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}

export default new ImageController();
