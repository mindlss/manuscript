const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = { Tag };
