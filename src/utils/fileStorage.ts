import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const getImagePath = (filename: string): string =>
    path.join(uploadDir, filename);

export const deleteImageFile = (filename: string): void => {
    const filePath = getImagePath(filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
