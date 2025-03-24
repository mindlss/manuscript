import express, { Request, Response, NextFunction, Express } from 'express';
import multer from 'multer';
import path from 'path';
import ImageController from '@controllers/imageController';

const router = express.Router();

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Загрузить изображение
router.post(
    '/upload',
    (req: Request, res: Response, next: NextFunction) => {
        upload.single('image')(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    message: 'Error uploading file',
                    error: err.message,
                });
            } else if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err.message,
                });
            }
            next();
        });
    },
    ImageController.uploadImage
);

// Получить список изображений
router.get('/', ImageController.getImages);

// Удалить изображение по id
router.delete('/:id', ImageController.removeImage);

export default router;
