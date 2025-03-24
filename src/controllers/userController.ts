import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserService from '@services/userService';
import { logger } from '@utils/logger';

class UserController {
    // Регистрация пользователя
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                logger.warn(
                    'Username and password are required for registration'
                );
                res.status(400).json({
                    error: 'Username and password are required',
                });
                return;
            }

            logger.info(`Registering new user: ${username}`);
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error during registration: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Вход по паролю
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                logger.warn('Username and password are required for login');
                res.status(400).json({
                    error: 'Username and password are required',
                });
                return;
            }

            logger.info(`User login attempt: ${username}`);
            const token = await UserService.authenticateUser(req.body);
            res.status(200).json({ token });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error during login: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // Получение информации о пользователе
    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                logger.warn(`Invalid user ID: ${userId}`);
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            logger.info(`Fetching user info for ID: ${userId}`);
            const user = await UserService.getUserById(userId);
            if (!user) {
                logger.warn(`User with ID ${userId} not found`);
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error fetching user: ${error.message}`);
                res.status(500).json({ error: error.message });
            } else {
                logger.error(`Unknown error occurred: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new UserController();
