const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const getImagePath = (filename) => path.join(uploadDir, filename);

const deleteImageFile = (filename) => {
    const filePath = getImagePath(filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

module.exports = { getImagePath, deleteImageFile };
