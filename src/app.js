import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import logger from './utils/logger.js';

import indexRoutes from './routes/index.js';
import articlesRoutes from './routes/articles.js';
import authRoutes from './routes/auth.js';
import tagsRoutes from './routes/tags.js';
import imageRoutes from './routes/images.js';
import categoryRoutes from './routes/categories.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', indexRoutes);
app.use('/articles', articlesRoutes);
app.use('/auth', authRoutes);
app.use('/tags', tagsRoutes);
app.use('/images', imageRoutes);
app.use('/categories', categoryRoutes);
app.use('/history', historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Backend is up and running on http://localhost:${PORT}`);
});
