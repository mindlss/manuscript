import mongoose from 'mongoose';
import { logger } from '@utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
