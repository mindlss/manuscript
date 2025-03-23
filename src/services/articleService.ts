import { Article } from '@models/articleModel';
import { Category } from '@models/categoryModel';
import articleHistoryService from '@services/articleHistoryService';

class ArticleService {
    // Создание статьи
    async createArticle(data: any, userId: string) {
        if (!data.category) {
            let uncategorized = await Category.findOne({
                name: 'uncategorized',
            });

            if (!uncategorized) {
                uncategorized = await Category.create({
                    name: 'uncategorized',
                    description: 'Articles without category',
                    position: 0,
                });
            }

            data.category = uncategorized._id;
        }

        const lastArticle = await Article.findOne({
            category: data.category,
        }).sort('-position');
        const position = lastArticle ? lastArticle.position + 1 : 1;

        return await Article.create({ ...data, position, author: userId });
    }

    // Получение статьи по ID с популяцией связанных данных
    async getArticleById(articleId: string) {
        return await Article.findById(articleId)
            .populate({
                path: 'category',
                select: '-createdAt -updatedAt -__v',
            })
            .populate({
                path: 'author',
                select: '-passwordHash -createdAt -updatedAt -__v',
            })
            .populate({
                path: 'images',
                select: '-createdAt -updatedAt -__v',
            })
            .populate({
                path: 'tags',
                select: '-createdAt -updatedAt -__v',
            });
    }

    // Получение id статей, сгруппированных по категориям
    async getArticles() {
        const articles = await Article.find()
            .populate('category')
            .sort({ position: 1 });

        return articles.reduce((acc: any, article: any) => {
            const categoryName = article.category.name;

            if (!acc[categoryName]) {
                acc[categoryName] = {
                    description: article.category.description,
                    position: article.category.position,
                    articles: [],
                };
            }

            acc[categoryName].articles.push({
                _id: article._id,
                title: article.title,
                position: article.position,
            });
            return acc;
        }, {});
    }

    // Обновление статьи (позиция не меняется)
    async updateArticle(articleId: string, updateData: any, editorId: string) {
        const article = await Article.findById(articleId);
        if (!article) {
            throw new Error('Article not found');
        }

        await articleHistoryService.createArticleHistory(
            {
                article: article._id,
                content: article.content,
                author: article.author,
                images: article.images,
                tags: article.tags,
                editedAt: new Date(),
            },
            editorId
        );

        return await Article.findByIdAndUpdate(articleId, updateData, {
            new: true,
        });
    }

    // Удаление статьи с коррекцией позиций в категории
    async deleteArticle(articleId: string) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Article not found');

        await articleHistoryService.deleteAllHistoryByArticle(articleId);

        await Article.findByIdAndDelete(articleId);

        await Article.updateMany(
            { category: article.category, position: { $gt: article.position } },
            { $inc: { position: -1 } }
        );

        return {
            message: 'The article has been removed along with its history, and the order has been updated',
        };
    }

    // Изменение позиции статьи внутри категории
    async reorderArticle(articleId: string, newPosition: number) {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('Article not found');

        const maxPosition = await Article.countDocuments({
            category: article.category,
        });
        if (newPosition < 1 || newPosition > maxPosition) {
            throw new Error('Incorrect position');
        }

        const swappedArticle = await Article.findOne({
            category: article.category,
            position: newPosition,
        });

        if (swappedArticle) {
            const originalPosition = article.position;

            await Article.findByIdAndUpdate(swappedArticle._id, {
                position: -1,
            });

            const originalArticle = await Article.findByIdAndUpdate(
                articleId,
                { position: newPosition },
                { new: true }
            );

            await Article.findByIdAndUpdate(swappedArticle._id, {
                position: originalPosition,
            });

            return originalArticle;
        }

        return await Article.findByIdAndUpdate(
            articleId,
            { position: newPosition },
            { new: true }
        );
    }
}

export default new ArticleService();
