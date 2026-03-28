import { BannerRepository } from './banner.repository';
import { BannerResponse, toBannerResponse } from './banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './banner.schema';
import { NotFoundError } from '../../shared/middleware/error-handler.middleware';
import { deleteFile } from '../upload/upload.service';
import { geminiService } from '../../shared/services/gemini.service';

export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async create(dto: CreateBannerDto): Promise<BannerResponse> {
    const translations = await geminiService.translate(
      { title: dto.title, subtitle: dto.subtitle },
      { context: 'promotional banner for filter-system factory e-commerce' },
    );

    const banner = await this.bannerRepository.create({
      title: translations.title,
      subtitle: translations.subtitle,
      image: dto.image,
      link: dto.link,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    } as any);

    return toBannerResponse(banner);
  }

  async findActive(): Promise<BannerResponse[]> {
    const banners = await this.bannerRepository.findActive();
    return banners.map(toBannerResponse);
  }

  async findAll(): Promise<BannerResponse[]> {
    const banners = await this.bannerRepository.findAll();
    return banners.map(toBannerResponse);
  }

  async findOne(id: string): Promise<BannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    return toBannerResponse(banner);
  }

  async update(id: string, dto: UpdateBannerDto): Promise<BannerResponse> {
    const existing = await this.bannerRepository.findById(id);
    if (!existing) throw new NotFoundError('Banner');

    const updateData: Record<string, unknown> = {};
    if (dto.image) updateData.image = dto.image;
    // Delete old image if replaced
    if (dto.image && existing.image && dto.image !== existing.image) {
      deleteFile(existing.image);
    }
    if (dto.link !== undefined) updateData.link = dto.link;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    if (dto.title || dto.subtitle) {
      const fieldsToTranslate: Record<string, string> = {};
      if (dto.title) fieldsToTranslate.title = dto.title;
      if (dto.subtitle) fieldsToTranslate.subtitle = dto.subtitle;

      const translations = await geminiService.translate(fieldsToTranslate, {
        context: 'promotional banner for filter-system factory e-commerce',
      });

      if (dto.title) updateData.title = translations.title;
      if (dto.subtitle) updateData.subtitle = translations.subtitle;
    }

    const updated = await this.bannerRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError('Banner');
    return toBannerResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    if (banner.image) deleteFile(banner.image);
    await this.bannerRepository.delete(id);
  }
}
