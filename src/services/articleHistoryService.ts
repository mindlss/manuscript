import { ArticleHistory } from '@models/articleHistoryModel';

class ArticleHistoryService {
    // Получение всех исторических версий статьи (id и editedAt)
    async getArticleHistory(articleId: string) {
        return await ArticleHistory.find({ article: articleId })
            .select('_id editedAt')
            .sort({ editedAt: -1 });
    }

    // Получение полной исторической версии по id
    async getHistoricalVersion(id: string) {
        return await ArticleHistory.findById(id);
    }

    // Создание новой исторической версии статьи
    async createArticleHistory(data: object, userId: string) {
        return await ArticleHistory.create({ ...data, editor: userId });
    }

    // Удаление исторической версии по ID
    async deleteHistoricalVersion(id: string) {
        return await ArticleHistory.findByIdAndDelete(id);
    }

    // Удаление всех исторических версий статьи
    async deleteAllHistoryByArticle(articleId: string) {
        return await ArticleHistory.deleteMany({ article: articleId });
    }
}

export default new ArticleHistoryService();
