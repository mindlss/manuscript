const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
