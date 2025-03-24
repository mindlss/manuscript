import express from 'express';
import TagController from '@controllers/tagController';

const router = express.Router();

// Получить список тегов
router.get(
    '/',
    TagController.getTags
);

// Создать тег
router.post(
    '/',
    TagController.createTag
);

// Удалить тег по ID
router.delete(
    '/:id',
    TagController.deleteTag
);

export default router;
