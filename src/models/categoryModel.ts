import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
    position: number;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        position: {
            type: Number,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
    'Category',
    categorySchema
);

export { Category };
