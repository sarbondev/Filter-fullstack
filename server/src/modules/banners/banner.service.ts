import { BannerRepository } from './banner.repository';
import { BannerResponse, toBannerResponse } from './banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './banner.schema';
import { NotFoundError } from '../../shared/middleware/error-handler.middleware';
import { deleteFile } from '../upload/upload.service';
import { emitToAll } from '../../shared/services/socket.service';

export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async create(dto: CreateBannerDto): Promise<BannerResponse> {
    const banner = await this.bannerRepository.create({
      image: dto.image,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as any);

    const response = toBannerResponse(banner);
    emitToAll('banner:created', response);
    return response;
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

    // Delete old image if replaced
    if (dto.image && existing.image && dto.image !== existing.image) {
      deleteFile(existing.image);
    }

    const updated = await this.bannerRepository.update(id, dto as any);
    if (!updated) throw new NotFoundError('Banner');
    const response = toBannerResponse(updated);
    emitToAll('banner:updated', response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    if (banner.image) deleteFile(banner.image);
    await this.bannerRepository.delete(id);
    emitToAll('banner:deleted', { id });
  }
}
