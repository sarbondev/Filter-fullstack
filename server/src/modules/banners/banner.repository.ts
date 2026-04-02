import { BannerModel } from './banner.schema';
import { IBanner } from './banner.entity';

export class BannerRepository {
  async create(data: Partial<IBanner>): Promise<IBanner> {
    const banner = new BannerModel(data);
    return banner.save();
  }

  async findById(id: string): Promise<IBanner | null> {
    return BannerModel.findById(id).lean<IBanner>();
  }

  async findActive(): Promise<IBanner[]> {
    return BannerModel.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean<IBanner[]>();
  }

  async findAll(): Promise<IBanner[]> {
    return BannerModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean<IBanner[]>();
  }

  async update(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
    return BannerModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IBanner>();
  }

  async delete(id: string): Promise<void> {
    await BannerModel.findByIdAndDelete(id);
  }
}
