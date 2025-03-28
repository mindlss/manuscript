// src/controllers/tagController.test.ts
import { Request, Response } from 'express';
import TagController from '@controllers/tagController';
import TagService from '@services/tagService';
import { logger } from '@utils/logger';

jest.mock('@services/tagService');
jest.mock('@utils/logger');

describe('TagController', () => {
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

    // тест получить тег
    describe('getTags', () => {
        it('should return tags successfully', async () => {
            const mockTags = [{ name: 'Tag1' }, { name: 'Tag2' }];
            (TagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);

            await TagController.getTags(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTags);
        });

        it('should handle errors when fetching tags', async () => {
            const mockError = new Error('Database error');
            (TagService.getAllTags as jest.Mock).mockRejectedValue(mockError);

            await TagController.getTags(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Error retrieving tags',
            });
            expect(logger.error).toHaveBeenCalledWith(
                'Error retrieving tags: Database error'
            );
        });
    });

    // тест создать тег
    describe('createTag', () => {
        it('should create a new tag successfully', async () => {
            const mockTag = { name: 'Tag1', content: 'Tag content' };
            (TagService.createTag as jest.Mock).mockResolvedValue(mockTag);

            req.body = { name: 'Tag1', content: 'Tag content' };

            await TagController.createTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTag);
            expect(logger.info).toHaveBeenCalledWith('Creating new tag: Tag1');
        });

        it('should return 400 if name or content are missing', async () => {
            req.body = { name: '' };

            await TagController.createTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Name and content are required',
            });
            expect(logger.warn).toHaveBeenCalledWith(
                'Name and content are required for creating a tag'
            );
        });

        it('should handle errors when creating a tag', async () => {
            const mockError = new Error('Database error');
            (TagService.createTag as jest.Mock).mockRejectedValue(mockError);

            req.body = { name: 'Tag1', content: 'Tag content' };

            await TagController.createTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Error creating tag',
            });
            expect(logger.error).toHaveBeenCalledWith(
                'Error creating tag: Database error'
            );
        });
    });

    // тест удалить тег
    describe('deleteTag', () => {
        it('should delete a tag successfully', async () => {
            const mockTag = { name: 'Tag1', content: 'Tag content' };
            (TagService.deleteTag as jest.Mock).mockResolvedValue(mockTag);
            req.params = { id: '1' };

            await TagController.deleteTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tag deleted' });
            expect(logger.info).toHaveBeenCalledWith('Deleting tag with ID: 1');
        });

        it('should return 404 if tag not found', async () => {
            (TagService.deleteTag as jest.Mock).mockResolvedValue(null);
            req.params = { id: '1' };

            await TagController.deleteTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tag not found' });
            expect(logger.warn).toHaveBeenCalledWith('Tag with ID 1 not found');
        });

        it('should handle errors when deleting a tag', async () => {
            const mockError = new Error('Database error');
            (TagService.deleteTag as jest.Mock).mockRejectedValue(mockError);
            req.params = { id: '1' };

            await TagController.deleteTag(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Error deleting tag',
            });
            expect(logger.error).toHaveBeenCalledWith(
                'Error deleting tag: Database error'
            );
        });
    });
});
