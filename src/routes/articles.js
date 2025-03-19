const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');
const { verifyToken } = require('../middlewares/authMiddleware');

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
router.patch(
    '/:articleId/reorder',
    verifyToken,
    ArticleController.reorderArticle
);

module.exports = router;
