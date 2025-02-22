const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');

// Создание статьи
router.post('/', ArticleController.createArticle);

// Получение статьи по ID
router.get('/:articleId', ArticleController.getArticleById);

// Получение списка статей
router.get('/', ArticleController.getArticles);

// Обновление статьи
router.patch('/:articleId', ArticleController.updateArticle);

// Удаление статьи
router.delete('/:articleId', ArticleController.deleteArticle);

module.exports = router;
