const CategoryService = require('../services/categoryService');
const mongoose = require('mongoose');

class CategoryController {
    // Получить все категории
    async getCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Получить категорию по ID
    async getCategory(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Incorrect category ID' });
            }

            const category = await CategoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Создать категорию
    async createCategory(req, res) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const newCategory = await CategoryService.createCategory({
                name,
                description,
            });
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Обновить категорию
    async updateCategory(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Incorrect category ID' });
            }

            const updatedCategory = await CategoryService.updateCategory(
                id,
                req.body
            );
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Удалить категорию
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Incorrect category ID' });
            }

            const deletedCategory = await CategoryService.deleteCategory(id);
            if (!deletedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Перенос категории (обновление позиции)
    async reorderCategory(req, res) {
        try {
            const { id } = req.params;
            const { newPosition } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Incorrect category ID' });
            }

            if (!Number.isInteger(newPosition) || newPosition < 1) {
                return res.status(400).json({ error: 'Incorrect position' });
            }

            const updatedCategory = await CategoryService.reorderCategory(
                id,
                newPosition
            );
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();
