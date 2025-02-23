const TagService = require('../services/tagService');

class TagController {
    // Получить все теги
    static async getTags(req, res) {
        try {
            const tags = await TagService.getAllTags();
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: 'Error during retrieving tags' });
        }
    }

    // Создать новый тег
    static async createTag(req, res) {
        try {
            const { name, content } = req.body;
            if (!name || !content) {
                return res.status(400).json({ error: 'Name and content are required' });
            }
            const newTag = await TagService.createTag({ name, content });
            res.status(201).json(newTag);
        } catch (error) {
            res.status(500).json({ error: 'Error during creating tag' });
        }
    }

    // Удалить тег по ID
    static async deleteTag(req, res) {
        try {
            const { id } = req.params;
            const deletedTag = await TagService.deleteTag(id);
            if (!deletedTag) {
                return res.status(404).json({ error: 'Tag not found' });
            }
            res.json({ message: 'Tag deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error during deleting tag' });
        }
    }
}

module.exports = TagController;
