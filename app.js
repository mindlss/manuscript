const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();
const app = express();

const connectDB = require('./config/db');
connectDB();

app.use(express.json());

app.use('/uploads', express.static('uploads'));

const indexRoutes = require('./routes/index');
const articlesRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');
const tagsRoutes = require('./routes/tags');
const imageRoutes = require('./routes/images');
app.use('/', indexRoutes);
app.use('/articles', articlesRoutes);
app.use('/auth', authRoutes);
app.use('/tags', tagsRoutes);
app.use('/images', imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Backend is up and running on http://localhost:${PORT}`);
});
