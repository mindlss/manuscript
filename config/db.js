const mongoose = require('mongoose');
const logger = require('../src/utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
