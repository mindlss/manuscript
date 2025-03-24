import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IImage extends Document {
    name: string;
    url: string;
}

const imageSchema = new Schema<IImage>(
    {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Image: Model<IImage> = mongoose.model<IImage>('Image', imageSchema);

export { Image };
