import { Article, IArticle } from '@models/articleModel';
import { Category, ICategory } from '@models/categoryModel';
import { IArticleHistory } from '@models/articleHistoryModel';
import articleHistoryService from '@services/articleHistoryService';
import mongoose from 'mongoose';
import { logger } from '@utils/logger';

interface ICreateArticleData {
    title: string;
    content: string;
    category?: mongoose.Types.ObjectId | ICategory;
    images?: string[];
    tags?: string[];
}

interface IUpdateArticleData {
    title?: string;
    content?: string;
    category?: mongoose.Types.ObjectId | ICategory;
    images?: string[];
    tags?: string[];
}

class ArticleService {
    // Создание статьи
    async createArticle(
        data: ICreateArticleData,
        userId: string
    ): Promise<IArticle> {
        logger.info(`Creating article with title: ${data.title}`);
        try {
            if (!data.category) {
                logger.debug('No category provided, using "uncategorized"');
                let uncategorized = await Category.findOne({
                    name: 'uncategorized',
                });

                if (!uncategorized) {
                    logger.debug('Creating "uncategorized" category');
                    uncategorized = await Category.create({
                        name: 'uncategorized',
                        description: 'Articles without category',
                        position: 0,
                    });
                }

                data.category = uncategorized._id as mongoose.Types.ObjectId;
            }

            const lastArticle = await Article.findOne({
                category: data.category,
            }).sort('-position');
            const position = lastArticle ? lastArticle.position + 1 : 1;

            const article = await Article.create({
                ...data,
                position,
                author: userId,
            });
            logger.info(`Article created with ID: ${article._id}`);
            return article;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Получение статьи по ID с популяцией связанных данных
    async getArticleById(articleId: string): Promise<IArticle | null> {
        logger.info(`Fetching article by ID: ${articleId}`);
        try {
            const article = await Article.findById(articleId)
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

            if (!article) {
                logger.warn(`Article with ID ${articleId} not found`);
            }

            return article;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Получение id статей, сгруппированных по категориям
    async getArticles(): Promise<
        Record<
            string,
            {
                description: string;
                position: number;
                articles: { _id: string; title: string; position: number }[];
            }
        >
    > {
        logger.info('Fetching all articles grouped by categories');
        try {
            const articles = await Article.find()
                .populate('category')
                .sort({ position: 1 });

            return articles.reduce((acc: any, article: IArticle) => {
                const category = article.category as ICategory;
                const categoryName = category.name;

                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        description: category.description,
                        position: category.position,
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
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Обновление статьи (позиция не меняется)
    async updateArticle(
        articleId: string,
        updateData: IUpdateArticleData,
        editorId: string
    ): Promise<IArticle | null> {
        logger.info(`Updating article with ID: ${articleId}`);
        try {
            const article = (await Article.findById(articleId)) as IArticle;
            if (!article) {
                logger.warn(`Article with ID ${articleId} not found`);
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
                } as Omit<IArticleHistory, '_id' | 'createdAt' | 'updatedAt'>,
                editorId
            );

            const updatedArticle = await Article.findByIdAndUpdate(
                articleId,
                updateData,
                {
                    new: true,
                }
            );
            logger.info(`Article with ID ${articleId} updated successfully`);
            return updatedArticle;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Удаление статьи с коррекцией позиций в категории
    async deleteArticle(articleId: string): Promise<{ message: string }> {
        logger.info(`Deleting article with ID: ${articleId}`);
        try {
            const article = await Article.findById(articleId);
            if (!article) {
                logger.warn(`Article with ID ${articleId} not found`);
                throw new Error('Article not found');
            }

            await articleHistoryService.deleteAllHistoryByArticle(articleId);
            await Article.findByIdAndDelete(articleId);

            await Article.updateMany(
                {
                    category: article.category,
                    position: { $gt: article.position },
                },
                { $inc: { position: -1 } }
            );

            logger.info(`Article with ID ${articleId} deleted successfully`);
            return {
                message:
                    'The article has been removed along with its history, and the order has been updated',
            };
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Изменение позиции статьи внутри категории
    async reorderArticle(
        articleId: string,
        newPosition: number
    ): Promise<IArticle | null> {
        logger.info(
            `Reordering article with ID: ${articleId} to position: ${newPosition}`
        );
        try {
            const article = await Article.findById(articleId);
            if (!article) {
                logger.warn(`Article with ID ${articleId} not found`);
                throw new Error('Article not found');
            }

            const maxPosition = await Article.countDocuments({
                category: article.category,
            });
            if (newPosition < 1 || newPosition > maxPosition) {
                logger.warn(
                    `Invalid position ${newPosition} for article with ID ${articleId}`
                );
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

                logger.info(
                    `Article with ID ${articleId} reordered successfully`
                );
                return originalArticle;
            }

            const updatedArticle = await Article.findByIdAndUpdate(
                articleId,
                { position: newPosition },
                { new: true }
            );
            logger.info(`Article with ID ${articleId} reordered successfully`);
            return updatedArticle;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating article: ${error.message}`);
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }
}

export default new ArticleService();
