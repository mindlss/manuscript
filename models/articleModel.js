const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema(
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

const Article = mongoose.model('Article', articleSchema);

module.exports = { Article };
