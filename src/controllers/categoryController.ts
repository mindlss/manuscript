import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CategoryService from '../services/categoryService';
import { logger } from '../utils/logger';

class CategoryController {
    // Получить все категории
    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Fetching all categories');
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error fetching categories: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Получить категорию по ID
    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Incorrect category ID: ${id}`);
                res.status(400).json({ error: 'Incorrect category ID' });
                return;
            }

            logger.info(`Fetching category with ID: ${id}`);
            const category = await CategoryService.getCategoryById(id);

            if (!category) {
                logger.warn(`Category with ID ${id} not found`);
                res.status(404).json({ error: 'Category not found' });
                return;
            }

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error fetching category: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Создать категорию
    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;

            if (!name) {
                logger.warn('Name is required for creating a category');
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            logger.info('Creating a new category');
            const newCategory = await CategoryService.createCategory({
                name,
                description,
            });
            res.status(201).json(newCategory);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating category: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Обновить категорию
    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Incorrect category ID: ${id}`);
                res.status(400).json({ error: 'Incorrect category ID' });
                return;
            }

            logger.info(`Updating category with ID: ${id}`);
            const updatedCategory = await CategoryService.updateCategory(
                id,
                req.body
            );

            if (!updatedCategory) {
                logger.warn(`Category with ID ${id} not found`);
                res.status(404).json({ error: 'Category not found' });
                return;
            }

            res.status(200).json(updatedCategory);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error updating category: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Удалить категорию
    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Incorrect category ID: ${id}`);
                res.status(400).json({ error: 'Incorrect category ID' });
                return;
            }

            logger.info(`Deleting category with ID: ${id}`);
            const deletedCategory = await CategoryService.deleteCategory(id);

            if (!deletedCategory) {
                logger.warn(`Category with ID ${id} not found`);
                res.status(404).json({ error: 'Category not found' });
                return;
            }

            res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error deleting category: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Перенос категории (обновление позиции)
    async reorderCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { newPosition } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Incorrect category ID: ${id}`);
                res.status(400).json({ error: 'Incorrect category ID' });
                return;
            }

            if (!Number.isInteger(newPosition) || newPosition < 1) {
                logger.warn(`Incorrect position: ${newPosition}`);
                res.status(400).json({ error: 'Incorrect position' });
                return;
            }

            logger.info(
                `Reordering category with ID: ${id} to position: ${newPosition}`
            );
            const updatedCategory = await CategoryService.reorderCategory(
                id,
                newPosition
            );

            if (!updatedCategory) {
                logger.warn(`Category with ID ${id} not found`);
                res.status(404).json({ error: 'Category not found' });
                return;
            }

            res.status(200).json(updatedCategory);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error reordering category: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new CategoryController();
