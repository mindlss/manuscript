import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITag extends Document {
    name: string;
    content: string;
}

const tagSchema = new Schema<ITag>(
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

const Tag: Model<ITag> = mongoose.model<ITag>('Tag', tagSchema);

export { Tag };
