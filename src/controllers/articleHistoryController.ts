import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ArticleHistoryService from '../services/articleHistoryService';
import { logger } from '../utils/logger';

class ArticleHistoryController {
    // Получение всех исторических версий статьи
    async getArticleHistory(req: Request, res: Response): Promise<void> {
        try {
            const { articleId } = req.params;

            // Проверка валидности ID статьи
            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                logger.warn(`Incorrect article ID: ${articleId}`);
                res.status(400).json({ error: 'Incorrect article ID' });
                return;
            }

            logger.info(`Fetching history for article with ID: ${articleId}`);
            const history = await ArticleHistoryService.getArticleHistory(
                articleId
            );
            res.json(history);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error fetching article history: ${error.message}`
                );
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Получение полной версии по ID исторической версии
    async getHistoricalVersion(req: Request, res: Response): Promise<void> {
        try {
            const { versionId } = req.params;

            // Проверка валидности ID версии
            if (!mongoose.Types.ObjectId.isValid(versionId)) {
                logger.warn(`Incorrect version ID: ${versionId}`);
                res.status(400).json({ error: 'Incorrect version ID' });
                return;
            }

            logger.info(`Fetching historical version with ID: ${versionId}`);
            const version = await ArticleHistoryService.getHistoricalVersion(
                versionId
            );

            if (!version) {
                logger.warn(
                    `Historical version with ID ${versionId} not found`
                );
                res.status(404).json({ error: 'Version not found' });
                return;
            }

            res.json(version);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error fetching historical version: ${error.message}`
                );
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new ArticleHistoryController();
