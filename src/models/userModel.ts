import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    passwordHash: string;
}

const userSchema = new Schema<IUser>(
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

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User };
