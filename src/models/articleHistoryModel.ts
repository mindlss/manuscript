import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IArticleHistory extends Document {
    article: mongoose.Types.ObjectId;
    content: string;
    author: mongoose.Types.ObjectId;
    editor: mongoose.Types.ObjectId;
    images: mongoose.Types.ObjectId[];
    tags: mongoose.Types.ObjectId[];
    editedAt: Date;
}

const articleHistorySchema = new Schema<IArticleHistory>(
    {
        article: {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        editor: {
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
        editedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const ArticleHistory: Model<IArticleHistory> = mongoose.model<IArticleHistory>(
    'ArticleHistory',
    articleHistorySchema
);

export { ArticleHistory };
