const { Tag } = require('../models/tagModel');

class TagService {
    // Получение всех тегов
    static async getAllTags() {
        return await Tag.find();
    }

    // Создание нового тега
    static async createTag(data) {
        return await Tag.create(data);
    }

    // Удаление тега по ID
    static async deleteTag(id) {
        return await Tag.findByIdAndDelete(id);
    }
}

module.exports = TagService;
