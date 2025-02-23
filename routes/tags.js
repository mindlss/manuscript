const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

// Получить список тегов
router.get('/', TagController.getTags);

// Создать тег
router.post('/', TagController.createTag);

// Удалить тег по ID
router.delete('/:id', TagController.deleteTag);

module.exports = router;
