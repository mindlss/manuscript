const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

class UserService {
    // Создание пользователя
    async createUser(data) {
        const { username, password } = data;

        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error('User with the same name already exists');

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({ username, passwordHash });
        return await newUser.save();
    }

    // Аутентификация пользователя (вход)
    async authenticateUser(data) {
        const { username, password } = data;

        const user = await User.findOne({ username });
        if (!user) throw new Error('Invalid username or password');

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) throw new Error('Invalid username or password');

        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return token;
    }

    // Получение пользователя по ID
    async getUserById(userId) {
        return await User.findById(userId);
    }
}

module.exports = new UserService();
