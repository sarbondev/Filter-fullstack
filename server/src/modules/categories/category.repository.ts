import { CategoryModel } from './category.schema';
import { ICategory } from './category.entity';

export class CategoryRepository {
  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new CategoryModel(data);
    return category.save();
  }

  async findById(id: string): Promise<ICategory | null> {
    return CategoryModel.findById(id).lean<ICategory>();
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return CategoryModel.findOne({ slug }).lean<ICategory>();
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<ICategory[]> {
    return CategoryModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean<ICategory[]>();
  }

  async findByParent(parentId: string | null): Promise<ICategory[]> {
    const filter = parentId ? { parent: parentId } : { parent: null };
    return CategoryModel.find(filter).sort({ sortOrder: 1 }).lean<ICategory[]>();
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<ICategory>();
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }

  async countByParent(parentId: string): Promise<number> {
    return CategoryModel.countDocuments({ parent: parentId });
  }
}
