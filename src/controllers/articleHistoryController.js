const ArticleHistoryService = require('../services/articleHistoryService');
const mongoose = require('mongoose');

class ArticleHistoryController {
    // Получение всех исторических версий статьи
    async getArticleHistory(req, res) {
        try {
            const { articleId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({ error: 'Incorrect article ID' });
            }

            const history = await ArticleHistoryService.getArticleHistory(
                articleId
            );
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Получение полной версии по ID исторической версии
    async getHistoricalVersion(req, res) {
        try {
            const { versionId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(versionId)) {
                return res.status(400).json({ error: 'Incorrect version ID' });
            }

            const version = await ArticleHistoryService.getHistoricalVersion(
                versionId
            );
            if (!version) {
                return res.status(404).json({ error: 'Version not found' });
            }

            res.json(version);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ArticleHistoryController();
