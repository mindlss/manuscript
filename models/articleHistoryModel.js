const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleHistorySchema = new Schema(
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

const ArticleHistory = mongoose.model('ArticleHistory', articleHistorySchema);

module.exports = { ArticleHistory };
