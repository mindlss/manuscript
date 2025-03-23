import express from 'express';
import ArticleController from '@controllers/articleController';
import { verifyToken } from '@middlewares/authMiddleware';

const router = express.Router();

// Создание статьи
router.post('/', verifyToken, ArticleController.createArticle);

// Получение статьи по ID
router.get('/:articleId', ArticleController.getArticleById);

// Получение списка статей
router.get('/', ArticleController.getArticles);

// Обновление статьи
router.patch('/:articleId', verifyToken, ArticleController.updateArticle);

// Удаление статьи
router.delete('/:articleId', verifyToken, ArticleController.deleteArticle);

// Изменение позиции статьи
router.patch('/:articleId/reorder', verifyToken, ArticleController.reorderArticle);

export default router;