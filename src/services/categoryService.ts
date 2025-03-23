import { Category } from '@models/categoryModel';

class CategoryService {
    // Получение всех категорий
    async getAllCategories() {
        return await Category.find();
    }

    // Получение категории по ID
    async getCategoryById(id: string) {
        return await Category.findById(id);
    }

    // Создание категории
    async createCategory(data: { name: string; description: string }) {
        const { name, description } = data;

        const lastCategory = await Category.findOne().sort('-position');
        const position = lastCategory ? lastCategory.position + 1 : 1;

        const newCategory = new Category({ name, description, position });
        return await newCategory.save();
    }

    // Обновление категории
    async updateCategory(id: string, data: any) {
        return await Category.findByIdAndUpdate(id, data, { new: true });
    }

    // Удаление категории с коррекцией позиций
    async deleteCategory(id: string) {
        const category = await Category.findById(id);
        if (!category) throw new Error('Category not found');

        if (category.position === 0) {
            throw new Error('You cannot delete the uncategorized category');
        }

        await Category.findByIdAndDelete(id);

        await Category.updateMany(
            { position: { $gt: category.position } },
            { $inc: { position: -1 } }
        );

        return {
            message:
                'The category has been removed and the order has been updated',
        };
    }

    // Изменение позиции категории
    async reorderCategory(id: string, newPosition: number) {
        const category = await Category.findById(id);
        if (!category) throw new Error('Category not found');

        const maxPosition = await Category.countDocuments();
        if (newPosition < 1 || newPosition > maxPosition) {
            throw new Error('Incorrect position');
        }

        const swappedCategory = await Category.findOne({
            position: newPosition,
        });

        if (swappedCategory) {
            const originalPosition = category.position;

            await Category.findByIdAndUpdate(swappedCategory._id, {
                position: -1,
            });

            const originalCategory = await Category.findByIdAndUpdate(
                id,
                { position: newPosition },
                { new: true }
            );

            await Category.findByIdAndUpdate(swappedCategory._id, {
                position: originalPosition,
            });

            return originalCategory;
        }

        return await Category.findByIdAndUpdate(
            id,
            { position: newPosition },
            { new: true }
        );
    }
}

export default new CategoryService();
