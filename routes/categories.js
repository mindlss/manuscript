const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Получить все категории
router.get('/', CategoryController.getCategories);

// Получить категорию по ID
router.get('/:id', CategoryController.getCategory);

// Создать категорию
router.post('/', verifyToken, CategoryController.createCategory);

// Обновить категорию
router.patch('/:id', verifyToken, CategoryController.updateCategory);

// Удалить категорию
router.delete('/:id', verifyToken, CategoryController.deleteCategory);

// Переместить категорию
router.patch('/:id/reorder', verifyToken, CategoryController.reorderCategory);

module.exports = router;
