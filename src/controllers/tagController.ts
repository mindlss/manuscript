import { Request, Response } from 'express';
import TagService from '@services/tagService';
import { logger } from '@utils/logger';

class TagController {
    // Получить все теги
    async getTags(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Fetching all tags');
            const tags = await TagService.getAllTags();
            res.status(200).json(tags);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error retrieving tags: ${error.message}`);
                res.status(500).json({ error: 'Error retrieving tags' });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Создать новый тег
    async createTag(req: Request, res: Response): Promise<void> {
        try {
            const { name, content } = req.body;
            if (!name || !content) {
                logger.warn('Name and content are required for creating a tag');
                res.status(400).json({
                    error: 'Name and content are required',
                });
                return;
            }

            logger.info(`Creating new tag: ${name}`);
            const newTag = await TagService.createTag({ name, content });
            res.status(201).json(newTag);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating tag: ${error.message}`);
                res.status(500).json({ error: 'Error creating tag' });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Удалить тег по ID
    async deleteTag(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`Deleting tag with ID: ${id}`);

            const deletedTag = await TagService.deleteTag(id);
            if (!deletedTag) {
                logger.warn(`Tag with ID ${id} not found`);
                res.status(404).json({ error: 'Tag not found' });
                return;
            }

            res.status(200).json({ message: 'Tag deleted' });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error deleting tag: ${error.message}`);
                res.status(500).json({ error: 'Error deleting tag' });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new TagController();
