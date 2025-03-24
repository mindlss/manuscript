import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { ICategory } from '@models/categoryModel';

export interface IArticle extends Document {
  _id: Types.ObjectId;
    title: string;
    content: string;
    category: Types.ObjectId | ICategory;
    author: Types.ObjectId;
    images: Types.ObjectId[];
    tags: Types.ObjectId[];
    position: number;
}

const articleSchema = new Schema<IArticle>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Image',
            },
        ],
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],
        position: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

articleSchema.index({ category: 1, position: 1 }, { unique: true });

const Article: Model<IArticle> = mongoose.model<IArticle>(
    'Article',
    articleSchema
);

export { Article };
