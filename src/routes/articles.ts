import express from 'express';
import ArticleController from '@controllers/articleController';
import AuthMiddleware from '@middlewares/authMiddleware';

const router = express.Router();

// Создание статьи
router.post(
    '/',
    AuthMiddleware.verifyToken,
    ArticleController.createArticle
);

// Получение статьи по ID
router.get(
    '/:articleId',
    ArticleController.getArticleById
);

// Получение списка статей
router.get('/',
    ArticleController.getArticles
);

// Обновление статьи
router.patch(
    '/:articleId',
    AuthMiddleware.verifyToken,
    ArticleController.updateArticle
);

// Удаление статьи
router.delete(
    '/:articleId',
    AuthMiddleware.verifyToken,
    ArticleController.deleteArticle
);

// Изменение позиции статьи
router.patch(
    '/:articleId/reorder',
    AuthMiddleware.verifyToken,
    ArticleController.reorderArticle
);

export default router;
