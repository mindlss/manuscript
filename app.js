const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();
const app = express();

const connectDB = require('./config/db');
connectDB();

app.use(express.json());

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Backend is up and running on http://localhost:${PORT}`);
});
