const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Регистрация пользователя
router.post('/register', UserController.register);

// Вход пользователя
router.post('/login', UserController.login);

// Получение информации о пользователе
router.get('/user', verifyToken, UserController.getUser);

module.exports = router;
