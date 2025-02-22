const { Article } = require('../models/articleModel');

class ArticleService {
    // Создание статьи с правильной позицией в пределах категории
    async createArticle(data) {
        const lastArticle = await Article.findOne({
            category: data.category,
        }).sort('-position');
        data.position = lastArticle ? lastArticle.position + 1 : 1;
        return await Article.create(data);
    }

    // Получение статьи по ID с популяцией связанных данных
    async getArticleById(articleId) {
        return await Article.findById(articleId)
            .populate('category')
            .populate('author')
            .populate('images')
            .populate('tags');
    }

    // Получение id статей сгруппированные по категориям
    async getArticles() {
        const articles = await Article.find()
            .populate('category')
            .sort({ position: 1 });

        // Группировка статей по категориям с добавлением информации о категории
        const groupedArticles = articles.reduce((acc, article) => {
            const category = article.category;
            const categoryName = category.name;

            if (!acc[categoryName]) {
                acc[categoryName] = {
                    description: category.description,
                    position: category.position,
                    articles: [],
                };
            }
            acc[categoryName].articles.push(article._id);
            return acc;
        }, {});

        return groupedArticles;
    }

    // Обновление статьи (позиция не меняется)
    async updateArticle(articleId, updateData) {
        return await Article.findByIdAndUpdate(articleId, updateData, {
            new: true,
        });
    }

    // Удаление статьи с коррекцией позиций в категории
    async deleteArticle(articleId) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Статья не найдена');

        // Удаляем статью
        await Article.findByIdAndDelete(articleId);

        // Сдвигаем все статьи этой категории с большим position вниз
        await Article.updateMany(
            { category: article.category, position: { $gt: article.position } },
            { $inc: { position: -1 } }
        );

        return { message: 'Статья удалена и порядок обновлён' };
    }

    // Изменение позиции статьи внутри категории
    async reorderArticle(articleId, newPosition) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Статья не найдена');

        const maxPosition = await Article.countDocuments({
            category: article.category,
        });
        if (newPosition < 1 || newPosition > maxPosition)
            throw new Error('Некорректная позиция');

        // Если место занято, меняем местами
        const swappedArticle = await Article.findOne({
            category: article.category,
            position: newPosition,
        });
        if (swappedArticle) {
            await Article.findByIdAndUpdate(swappedArticle._id, {
                position: article.position,
            });
        }

        return await Article.findByIdAndUpdate(
            articleId,
            { position: newPosition },
            { new: true }
        );
    }
}

module.exports = new ArticleService();
