const { Article } = require('../models/articleModel');
const { Category } = require('../models/categoryModel');

class ArticleService {
    // Создание статьи
    async createArticle(data) {
        if (!data.category) {
            let uncategorized = await Category.findOne({ name: 'uncategorized' });

            if (!uncategorized) {
                uncategorized = await Category.create({
                    name: 'uncategorized',
                    description: 'Articles without category',
                    position: 0,
                });
            }

            data.category = uncategorized._id;
        }

        const lastArticle = await Article.findOne({ category: data.category }).sort('-position');
        const position = lastArticle ? lastArticle.position + 1 : 1;

        return await Article.create({ ...data, position });
    }

    // Получение статьи по ID с популяцией связанных данных
    async getArticleById(articleId) {
        return await Article.findById(articleId)
            .populate('category')
            .populate('author')
            .populate('images')
            .populate('tags');
    }

    // Получение id статей, сгруппированных по категориям
    async getArticles() {
        const articles = await Article.find()
            .populate('category')
            .sort({ position: 1 });

        return articles.reduce((acc, article) => {
            const categoryName = article.category.name;

            if (!acc[categoryName]) {
                acc[categoryName] = {
                    description: article.category.description,
                    position: article.category.position,
                    articles: [],
                };
            }

            acc[categoryName].articles.push(article._id);
            return acc;
        }, {});
    }

    // Обновление статьи (позиция не меняется)
    async updateArticle(articleId, updateData) {
        return await Article.findByIdAndUpdate(articleId, updateData, { new: true });
    }

    // Удаление статьи с коррекцией позиций в категории
    async deleteArticle(articleId) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Article not found');

        await Article.findByIdAndDelete(articleId);

        await Article.updateMany(
            { category: article.category, position: { $gt: article.position } },
            { $inc: { position: -1 } }
        );

        return { message: 'The article has been removed and the order has been updated' };
    }

    // Изменение позиции статьи внутри категории
    async reorderArticle(articleId, newPosition) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Article not found');

        const maxPosition = await Article.countDocuments({ category: article.category });
        if (newPosition < 1 || newPosition > maxPosition) {
            throw new Error('Incorrect position');
        }

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
