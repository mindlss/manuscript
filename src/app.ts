import express from 'express';
import dotenv from 'dotenv';
import connectDB from '@config/db';
import { logger } from '@utils/logger';

import articlesRoutes from '@routes/articles';
import authRoutes from '@routes/auth';
import tagsRoutes from '@routes/tags';
import imageRoutes from '@routes/images';
import categoryRoutes from '@routes/categories';
import historyRoutes from '@routes/history';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

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
