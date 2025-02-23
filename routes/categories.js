const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

// Получить все категории
router.get('/', CategoryController.getCategories);

// Получить категорию по ID
router.get('/:id', CategoryController.getCategory);

// Создать категорию
router.post('/', CategoryController.createCategory);

// Обновить категорию
router.patch('/:id', CategoryController.updateCategory);

// Удалить категорию
router.delete('/:id', CategoryController.deleteCategory);

// Переместить категорию
router.patch('/:id/reorder', CategoryController.reorderCategory);

module.exports = router;
