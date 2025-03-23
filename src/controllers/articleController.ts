import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ArticleService from '@services/articleService';
import { logger } from '@utils/logger';

class ArticleController {
    // Создание статьи
    async createArticle(req: Request, res: Response): Promise<void> {
        try {
            const { category, title } = req.body;

            if (!title) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }

            if (category && !mongoose.Types.ObjectId.isValid(category)) {
                res.status(400).json({ error: 'Incorrect category ID' });
                return;
            }

            const userId = req.userId as string;

            const article = await ArticleService.createArticle(
                req.body,
                userId
            );
            res.status(201).json(article);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Получение статьи по ID
    async getArticleById(req: Request, res: Response): Promise<void> {
        try {
            const { articleId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                res.status(400).json({ error: 'Incorrect article ID' });
                return;
            }

            const article = await ArticleService.getArticleById(articleId);
            if (!article) {
                res.status(404).json({ error: 'Article not found' });
                return;
            }

            res.json(article);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error fetching article by ID: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Получение списка статей
    async getArticles(req: Request, res: Response): Promise<void> {
        try {
            const groupedArticles = await ArticleService.getArticles();
            res.json(groupedArticles);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error fetching articles: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Обновление статьи
    async updateArticle(req: Request, res: Response): Promise<void> {
        try {
            const { articleId } = req.params;
            const updateData = req.body;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                res.status(400).json({ error: 'Incorrect article ID' });
                return;
            }

            const userId = req.userId as string;

            const updatedArticle = await ArticleService.updateArticle(
                articleId,
                updateData,
                userId
            );
            if (!updatedArticle) {
                res.status(404).json({ error: 'Article not found' });
                return;
            }

            res.json(updatedArticle);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error updating article: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Удаление статьи
    async deleteArticle(req: Request, res: Response): Promise<void> {
        try {
            const { articleId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                res.status(400).json({ error: 'Incorrect article ID' });
                return;
            }

            const result = await ArticleService.deleteArticle(articleId);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error deleting article: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Изменение позиции статьи
    async reorderArticle(req: Request, res: Response): Promise<void> {
        try {
            const { articleId } = req.params;
            const { newPosition } = req.body;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                res.status(400).json({ error: 'Incorrect article ID' });
                return;
            }

            if (!Number.isInteger(newPosition) || newPosition < 1) {
                res.status(400).json({ error: 'Incorrect position' });
                return;
            }

            const updatedArticle = await ArticleService.reorderArticle(
                articleId,
                newPosition
            );
            res.json(updatedArticle);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error reordering article: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new ArticleController();
