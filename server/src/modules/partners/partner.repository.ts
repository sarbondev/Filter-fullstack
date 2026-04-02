import { PartnerModel } from './partner.schema';
import { IPartner } from './partner.entity';

export class PartnerRepository {
  async create(data: Partial<IPartner>): Promise<IPartner> {
    const partner = new PartnerModel(data);
    return partner.save();
  }

  async findById(id: string): Promise<IPartner | null> {
    return PartnerModel.findById(id).lean<IPartner>();
  }

  async findActive(): Promise<IPartner[]> {
    return PartnerModel.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean<IPartner[]>();
  }

  async findAll(): Promise<IPartner[]> {
    return PartnerModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean<IPartner[]>();
  }

  async update(id: string, data: Partial<IPartner>): Promise<IPartner | null> {
    return PartnerModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IPartner>();
  }

  async delete(id: string): Promise<void> {
    await PartnerModel.findByIdAndDelete(id);
  }
}
