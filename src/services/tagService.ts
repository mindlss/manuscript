import { Tag } from '../models/tagModel.js';

class TagService {
    // Получение всех тегов
    static async getAllTags() {
        return await Tag.find();
    }

    // Создание нового тега
    static async createTag(data: any) {
        return await Tag.create(data);
    }

    // Удаление тега по ID
    static async deleteTag(id: string) {
        return await Tag.findByIdAndDelete(id);
    }
}

export default TagService;
