import { CategoryRepository } from './category.repository';
import { CategoryResponse, toCategoryResponse } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';
import { NotFoundError, ConflictError } from '../../shared/middleware/error-handler.middleware';
import { deleteFile } from '../upload/upload.service';
import { geminiService } from '../../shared/services/gemini.service';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = this.slugify(name);
    if (!slug) slug = 'category';
    let candidate = slug;
    let counter = 0;
    while (await this.categoryRepository.findBySlug(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    const slug = dto.slug || await this.generateUniqueSlug(dto.name);

    const { name, description } = await geminiService.translateWithDescription(dto.name);

    const category = await this.categoryRepository.create({
      slug,
      image: dto.image,
      parent: dto.parent as any,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      name,
      description,
    } as any);

    return toCategoryResponse(category);
  }

  async findAll(activeOnly = false): Promise<CategoryResponse[]> {
    const filter = activeOnly ? { isActive: true } : {};
    const categories = await this.categoryRepository.findAll(filter);
    return categories.map(toCategoryResponse);
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category');
    return toCategoryResponse(category);
  }

  async findBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError('Category');
    return toCategoryResponse(category);
  }

  async findTree(): Promise<CategoryResponse[]> {
    const all = await this.categoryRepository.findAll({ isActive: true });
    const map = new Map<string, CategoryResponse>();
    const roots: CategoryResponse[] = [];

    for (const cat of all) {
      map.set(String(cat._id), { ...toCategoryResponse(cat), children: [] });
    }

    for (const cat of all) {
      const node = map.get(String(cat._id))!;
      if (cat.parent) {
        const parentNode = map.get(String(cat.parent));
        if (parentNode) parentNode.children!.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category');

    const updateData: Record<string, unknown> = {};
    if (dto.name && !dto.slug) {
      updateData.slug = await this.generateUniqueSlug(dto.name);
    } else if (dto.slug) {
      updateData.slug = dto.slug;
    }
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.image !== undefined && existing.image && dto.image !== existing.image) {
      deleteFile(existing.image);
    }
    if (dto.parent !== undefined) updateData.parent = dto.parent;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    if (dto.name) {
      const { name, description } = await geminiService.translateWithDescription(dto.name);
      updateData.name = name;
      updateData.description = description;
    }

    const updated = await this.categoryRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError('Category');
    return toCategoryResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category');

    const childCount = await this.categoryRepository.countByParent(id);
    if (childCount > 0) throw new ConflictError('Cannot delete category with subcategories');

    if (category.image) deleteFile(category.image);
    await this.categoryRepository.delete(id);
  }
}
