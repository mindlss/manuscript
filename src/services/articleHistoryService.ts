import { ArticleHistory, IArticleHistory } from '@models/articleHistoryModel';
import { logger } from '@utils/logger';

class ArticleHistoryService {
    // Получение всех исторических версий статьи (id и editedAt)
    async getArticleHistory(articleId: string): Promise<IArticleHistory[]> {
        logger.info(`Fetching history for article with ID: ${articleId}`);
        try {
            const history = await ArticleHistory.find({ article: articleId })
                .select('_id editedAt')
                .sort({ editedAt: -1 });

            logger.info(
                `Found ${history.length} historical versions for article with ID: ${articleId}`
            );
            return history;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error fetching article history: ${error.message}`
                );
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Получение полной исторической версии по id
    async getHistoricalVersion(id: string): Promise<IArticleHistory | null> {
        logger.info(`Fetching historical version with ID: ${id}`);
        try {
            const historicalVersion = await ArticleHistory.findById(id);
            if (!historicalVersion) {
                logger.warn(`Historical version with ID ${id} not found`);
            }
            return historicalVersion;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error fetching historical version: ${error.message}`
                );
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Создание новой исторической версии статьи
    async createArticleHistory(
        data: Omit<IArticleHistory, '_id' | 'createdAt' | 'updatedAt'>,
        userId: string
    ): Promise<IArticleHistory> {
        logger.info('Creating new historical version for article');
        try {
            const historicalVersion = await ArticleHistory.create({
                ...data,
                editor: userId,
            });
            logger.info(
                `Historical version created with ID: ${historicalVersion._id}`
            );
            return historicalVersion;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error creating historical version: ${error.message}`
                );
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Удаление исторической версии по ID
    async deleteHistoricalVersion(id: string): Promise<IArticleHistory | null> {
        logger.info(`Deleting historical version with ID: ${id}`);
        try {
            const deletedVersion = await ArticleHistory.findByIdAndDelete(id);
            if (!deletedVersion) {
                logger.warn(`Historical version with ID ${id} not found`);
            } else {
                logger.info(
                    `Historical version with ID ${id} deleted successfully`
                );
            }
            return deletedVersion;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error deleting historical version: ${error.message}`
                );
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }

    // Удаление всех исторических версий статьи
    async deleteAllHistoryByArticle(
        articleId: string
    ): Promise<{ deletedCount?: number }> {
        logger.info(
            `Deleting all historical versions for article with ID: ${articleId}`
        );
        try {
            const result = await ArticleHistory.deleteMany({
                article: articleId,
            });
            logger.info(
                `Deleted ${result.deletedCount} historical versions for article with ID: ${articleId}`
            );
            return result;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error deleting all historical versions: ${error.message}`
                );
            } else {
                logger.error(`Unknown error occurred: ${error}`);
            }
            throw error;
        }
    }
}

export default new ArticleHistoryService();
