import express from 'express';
import ArticleHistoryController from '@controllers/articleHistoryController';

const router = express.Router();

// Получение всех исторических версий статьи
router.get(
    '/article/:articleId',
    ArticleHistoryController.getArticleHistory
);

// Получение полной версии по ID исторической версии
router.get(
    '/:versionId',
    ArticleHistoryController.getHistoricalVersion
);

export default router;
