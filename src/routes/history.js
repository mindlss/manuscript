const express = require('express');
const router = express.Router();

const ArticleHistoryController = require('../controllers/articleHistoryController');

// Получение всех исторических версий статьи
router.get('/article/:articleId', ArticleHistoryController.getArticleHistory);

// Получение полной версии по ID исторической версии
router.get('/:versionId', ArticleHistoryController.getHistoricalVersion);

module.exports = router;