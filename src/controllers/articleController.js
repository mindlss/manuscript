const ArticleService = require('../services/articleService');
const mongoose = require('mongoose');

class ArticleController {
    // Создание статьи
    async createArticle(req, res) {
        try {
            const { category, title } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            if (category && !mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ error: 'Incorrect category ID' });
            }

            const userId = req.userId;

            const article = await ArticleService.createArticle(
                req.body,
                userId
            );
            res.status(201).json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Получение статьи по ID
    async getArticleById(req, res) {
        try {
            const { articleId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({ error: 'Incorrect article ID' });
            }

            const article = await ArticleService.getArticleById(articleId);
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }

            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Получение id статей, сгруппированных по категориям
    async getArticles(req, res) {
        try {
            const groupedArticles = await ArticleService.getArticles();
            res.json(groupedArticles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Обновление статьи
    async updateArticle(req, res) {
        try {
            const { articleId } = req.params;
            const updateData = req.body;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({ error: 'Incorrect article ID' });
            }

            const userId = req.userId;

            const updatedArticle = await ArticleService.updateArticle(
                articleId,
                updateData,
                userId
            );
            if (!updatedArticle) {
                return res.status(404).json({ error: 'Article not found' });
            }

            res.json(updatedArticle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Удаление статьи
    async deleteArticle(req, res) {
        try {
            const { articleId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({ error: 'Incorrect article ID' });
            }

            const result = await ArticleService.deleteArticle(articleId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Изменение позиции статьи
    async reorderArticle(req, res) {
        try {
            const { articleId } = req.params;
            const { newPosition } = req.body;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({ error: 'Incorrect article ID' });
            }

            if (!Number.isInteger(newPosition) || newPosition < 1) {
                return res.status(400).json({ error: 'Incorrect position' });
            }

            const updatedArticle = await ArticleService.reorderArticle(
                articleId,
                newPosition
            );
            res.json(updatedArticle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ArticleController();
