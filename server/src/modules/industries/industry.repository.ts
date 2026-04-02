import { IndustryModel } from './industry.schema';
import { IIndustry } from './industry.entity';

export class IndustryRepository {
  async create(data: Partial<IIndustry>): Promise<IIndustry> {
    const industry = new IndustryModel(data);
    return industry.save();
  }

  async findById(id: string): Promise<IIndustry | null> {
    return IndustryModel.findById(id).lean<IIndustry>();
  }

  async findActive(): Promise<IIndustry[]> {
    return IndustryModel.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean<IIndustry[]>();
  }

  async findAll(): Promise<IIndustry[]> {
    return IndustryModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean<IIndustry[]>();
  }

  async update(id: string, data: Partial<IIndustry>): Promise<IIndustry | null> {
    return IndustryModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IIndustry>();
  }

  async delete(id: string): Promise<void> {
    await IndustryModel.findByIdAndDelete(id);
  }
}
