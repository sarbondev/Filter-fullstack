import { BlogRepository } from './blog.repository';
import { BlogResponse, toBlogResponse } from './blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './blog.schema';
import { NotFoundError } from '../../shared/middleware/error-handler.middleware';
import { deleteFile } from '../upload/upload.service';
import { geminiService } from '../../shared/services/gemini.service';
import { PaginatedResponse } from '../../shared/types/common.types';
import { buildPaginatedResponse } from '../../shared/utils/pagination';

export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = this.slugify(title);
    if (!slug) slug = 'blog';
    let candidate = slug;
    let counter = 0;
    while (await this.blogRepository.findBySlug(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  async create(dto: CreateBlogDto): Promise<BlogResponse> {
    const slug = await this.generateUniqueSlug(dto.title);

    const translations = await geminiService.translate(
      { title: dto.title, content: dto.content },
      { context: 'blog post for a filter-system factory e-commerce platform' },
    );

    // Generate excerpt as a separate call with a clear instruction
    let excerpt;
    try {
      excerpt = await geminiService.translateOne(
        dto.content.slice(0, 300),
        { context: 'Write a 1-2 sentence summary/excerpt of this blog post content for a filter-system factory e-commerce platform' },
      );
    } catch {
      excerpt = {
        uz: dto.content.slice(0, 150),
        ru: dto.content.slice(0, 150),
        en: dto.content.slice(0, 150),
      };
    }

    const blog = await this.blogRepository.create({
      slug,
      image: dto.image,
      isPublished: dto.isPublished,
      title: translations.title,
      content: translations.content,
      excerpt,
    } as any);

    return toBlogResponse(blog);
  }

  async findAll(page: number, limit: number, publishedOnly = false): Promise<PaginatedResponse<BlogResponse>> {
    const skip = (page - 1) * limit;
    const filter = publishedOnly ? { isPublished: true } : {};
    const { data, total } = await this.blogRepository.findAll(filter, skip, limit);
    return buildPaginatedResponse(data.map(toBlogResponse), total, { page, limit, skip });
  }

  async findOne(id: string): Promise<BlogResponse> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundError('Blog');
    return toBlogResponse(blog);
  }

  async findBySlug(slug: string): Promise<BlogResponse> {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new NotFoundError('Blog');
    await this.blogRepository.incrementViews(String(blog._id));
    return toBlogResponse(blog);
  }

  async update(id: string, dto: UpdateBlogDto): Promise<BlogResponse> {
    const existing = await this.blogRepository.findById(id);
    if (!existing) throw new NotFoundError('Blog');

    const updateData: Record<string, unknown> = {};

    if (dto.image !== undefined) {
      updateData.image = dto.image;
      if (existing.image && dto.image !== existing.image) deleteFile(existing.image);
    }
    if (dto.isPublished !== undefined) updateData.isPublished = dto.isPublished;

    if (dto.title || dto.content) {
      const fieldsToTranslate: Record<string, string> = {};
      if (dto.title) fieldsToTranslate.title = dto.title;
      if (dto.content) fieldsToTranslate.content = dto.content;

      const translations = await geminiService.translate(fieldsToTranslate, {
        context: 'blog post for a filter-system factory e-commerce platform',
      });

      Object.assign(updateData, translations);

      if (dto.title) {
        updateData.slug = await this.generateUniqueSlug(dto.title);
      }
    }

    const updated = await this.blogRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError('Blog');
    return toBlogResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundError('Blog');
    if (blog.image) deleteFile(blog.image);
    await this.blogRepository.delete(id);
  }
}
