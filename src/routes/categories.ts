import express from 'express';
import CategoryController from '@controllers/categoryController';
import AuthMiddleware from '@middlewares/authMiddleware';

const router = express.Router();

// Получить все категории
router.get(
    '/',
    CategoryController.getCategories
);

// Получить категорию по ID
router.get(
    '/:id',
    CategoryController.getCategory
);

// Создать категорию (требуется авторизация)
router.post(
    '/',
    AuthMiddleware.verifyToken,
    CategoryController.createCategory
);

// Обновить категорию (требуется авторизация)
router.patch(
    '/:id',
    AuthMiddleware.verifyToken,
    CategoryController.updateCategory
);

// Удалить категорию (требуется авторизация)
router.delete(
    '/:id',
    AuthMiddleware.verifyToken,
    CategoryController.deleteCategory
);

// Переместить категорию (требуется авторизация)
router.patch(
    '/:id/reorder',
    AuthMiddleware.verifyToken,
    CategoryController.reorderCategory
);

export default router;
