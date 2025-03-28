import { Request, Response } from 'express';
import ArticleController from '@controllers/articleController';
import ArticleService from '@services/articleService';
import { logger } from '@utils/logger';
import mongoose from 'mongoose';

jest.mock('@services/articleService');
jest.mock('@utils/logger');

describe('ArticleController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Тест для createArticle
    describe('createArticle', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;

        const mockArticle = {
            id: new mongoose.Types.ObjectId().toString(),
            title: 'Test Article',
        };

        const mockUserId = new mongoose.Types.ObjectId().toString();

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {};
            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should create an article successfully', async () => {
            (ArticleService.createArticle as jest.Mock).mockResolvedValue(
                mockArticle
            );

            req.body = { title: 'Test Article' };
            req.userId = mockUserId;

            await ArticleController.createArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockArticle);
        });

        it('should return 400 if title is missing', async () => {
            req.body = {};

            await ArticleController.createArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Title is required',
            });
        });

        it('should handle errors when creating an article', async () => {
            const mockError = new Error('Database error');
            (ArticleService.createArticle as jest.Mock).mockRejectedValue(
                mockError
            );

            req.body = { title: 'Test Article' };
            req.userId = mockUserId;

            await ArticleController.createArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
            expect(logger.error).toHaveBeenCalledWith(
                `Error creating article: ${mockError.message}`
            );
        });
    });

    // Тест для getArticleById
    describe('getArticleById', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;

        const mockArticle = {
            id: new mongoose.Types.ObjectId().toString(),
            title: 'Test Article',
        };

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {};
            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should return an article by ID', async () => {
            (ArticleService.getArticleById as jest.Mock).mockResolvedValue(
                mockArticle
            );

            req.params = { articleId: mockArticle.id };

            await ArticleController.getArticleById(
                req as Request,
                res as Response
            );

            expect(res.status).not.toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(mockArticle);
        });

        it('should return 400 if articleId is invalid', async () => {
            req.params = { articleId: 'invalidId' };

            await ArticleController.getArticleById(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Incorrect article ID',
            });
        });

        it('should return 404 if article is not found', async () => {
            (ArticleService.getArticleById as jest.Mock).mockResolvedValue(
                null
            );
            req.params = {
                articleId: new mongoose.Types.ObjectId().toString(),
            };

            await ArticleController.getArticleById(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Article not found',
            });
        });

        it('should handle errors when fetching an article', async () => {
            const mockError = new Error('Database error');
            (ArticleService.getArticleById as jest.Mock).mockRejectedValue(
                mockError
            );

            req.params = {
                articleId: new mongoose.Types.ObjectId().toString(),
            };

            await ArticleController.getArticleById(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
            expect(logger.error).toHaveBeenCalledWith(
                `Error fetching article by ID: ${mockError.message}`
            );
        });
    });

    // Тест для getArticles
    describe('getArticles', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;

        const mockArticles = [
            {
                id: new mongoose.Types.ObjectId().toString(),
                title: 'Test Article 1',
            },
            {
                id: new mongoose.Types.ObjectId().toString(),
                title: 'Test Article 2',
            },
        ];

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {};
            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should return a list of articles', async () => {
            (ArticleService.getArticles as jest.Mock).mockResolvedValue(
                mockArticles
            );

            await ArticleController.getArticles(
                req as Request,
                res as Response
            );

            expect(res.status).not.toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(mockArticles);
        });

        it('should handle errors when fetching articles', async () => {
            const mockError = new Error('Database error');
            (ArticleService.getArticles as jest.Mock).mockRejectedValue(
                mockError
            );

            await ArticleController.getArticles(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
            expect(logger.error).toHaveBeenCalledWith(
                `Error fetching articles: ${mockError.message}`
            );
        });
    });

    // Тест для updateArticle
    describe('updateArticle', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;
        const mockArticleId = new mongoose.Types.ObjectId().toString();
        const mockUserId = new mongoose.Types.ObjectId().toString();
        const updatedArticle = {
            _id: mockArticleId,
            title: 'Updated Article',
            content: 'Updated content',
            author: mockUserId,
            tags: [mockUserId],
        };

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {
                body: { title: 'Updated Article' },
                params: { articleId: mockArticleId },
                userId: mockUserId,
            };

            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should update an article successfully', async () => {
            (ArticleService.updateArticle as jest.Mock).mockResolvedValue(
                updatedArticle
            );

            await ArticleController.updateArticle(
                req as Request,
                res as Response
            );

            expect(ArticleService.updateArticle).toHaveBeenCalledWith(
                mockArticleId,
                req.body,
                req.userId
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedArticle);
        });

        it('should return 400 if article ID is invalid', async () => {
            req.params!.articleId = 'invalidId';

            await ArticleController.updateArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Incorrect article ID',
            });
        });

        it('should return 404 if article not found', async () => {
            (ArticleService.updateArticle as jest.Mock).mockResolvedValue(null);
            req.params!.articleId = mockArticleId;

            await ArticleController.updateArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Article not found',
            });
        });

        it('should handle errors when updating an article', async () => {
            const mockError = new Error('Database error');
            (ArticleService.updateArticle as jest.Mock).mockRejectedValue(
                mockError
            );

            req.params!.articleId = mockArticleId;

            await ArticleController.updateArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
            expect(logger.error).toHaveBeenCalledWith(
                `Error updating article: ${mockError.message}`
            );
        });
    });

    // Тест для deleteArticle
    describe('deleteArticle', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;
        const mockArticleId = new mongoose.Types.ObjectId().toString();
        const deleteResult = {
            message:
                'The article has been removed along with its history, and the order has been updated',
        };

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {
                params: { articleId: mockArticleId },
            };

            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should delete an article successfully', async () => {
            (ArticleService.deleteArticle as jest.Mock).mockResolvedValue(
                deleteResult
            );

            await ArticleController.deleteArticle(
                req as Request,
                res as Response
            );

            expect(ArticleService.deleteArticle).toHaveBeenCalledWith(
                mockArticleId
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deleteResult);
        });

        it('should return 404 if article not found', async () => {
            (ArticleService.deleteArticle as jest.Mock).mockResolvedValue(null);
            req.params!.articleId = mockArticleId;

            await ArticleController.deleteArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Article not found',
            });
        });

        it('should handle errors when deleting an article', async () => {
            const mockError = new Error('Database error');
            (ArticleService.deleteArticle as jest.Mock).mockRejectedValue(
                mockError
            );

            req.params!.articleId = mockArticleId;

            await ArticleController.deleteArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
            expect(logger.error).toHaveBeenCalledWith(
                `Error deleting article: ${mockError.message}`
            );
        });
    });

    // Тест для reorderArticles
    describe('reorderArticle', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let jsonMock: jest.Mock;
        let statusMock: jest.Mock;

        beforeEach(() => {
            jsonMock = jest.fn();
            statusMock = jest.fn().mockReturnValue({ json: jsonMock });

            req = {
                params: { articleId: new mongoose.Types.ObjectId().toString() },
                body: { newPosition: 2 },
            };

            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        it('should reorder article successfully', async () => {
            const mockArticle = { _id: req.params!.articleId, position: 2 };

            (ArticleService.reorderArticle as jest.Mock).mockResolvedValue(
                mockArticle
            );

            await ArticleController.reorderArticle(
                req as Request,
                res as Response
            );

            expect(ArticleService.reorderArticle).toHaveBeenCalledWith(
                req.params!.articleId,
                req.body!.newPosition
            );

            expect(res.json).toHaveBeenCalledWith(mockArticle);
        });

        it('should return 400 for invalid article ID', async () => {
            req.params!.articleId = 'invalid_id';

            await ArticleController.reorderArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Incorrect article ID',
            });
        });

        it('should return 400 for invalid position', async () => {
            req.body!.newPosition = -1;

            await ArticleController.reorderArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Incorrect position',
            });
        });

        it('should return 500 and log error when service throws an error', async () => {
            const mockError = new Error('Database error');
            (ArticleService.reorderArticle as jest.Mock).mockRejectedValue(
                mockError
            );

            await ArticleController.reorderArticle(
                req as Request,
                res as Response
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });
    });
});
