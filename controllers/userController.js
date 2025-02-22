const UserService = require('../services/userService');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

class UserController {
    // Регистрация пользователя
    async register(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Вход по паролю
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const token = await UserService.authenticateUser(req.body);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Получение информации о пользователе
    async getUser(req, res) {
        try {
            const userId = req.userId;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
