import express from 'express';
import UserController from '@controllers/userController';
import AuthMiddleware from '@middlewares/authMiddleware';

const router = express.Router();

// Регистрация пользователя
router.post(
    '/register',
    UserController.register
);

// Вход пользователя
router.post(
    '/login',
    UserController.login
);

// Получение информации о пользователе (требуется авторизация)
router.get(
    '/user',
    AuthMiddleware.verifyToken,
    UserController.getUser
);

export default router;
