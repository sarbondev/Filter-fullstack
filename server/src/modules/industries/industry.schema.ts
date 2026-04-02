import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IIndustry } from './industry.entity';

const translatedFieldSchema = new Schema(
  { uz: { type: String, required: true }, ru: { type: String, required: true }, en: { type: String, required: true }, kz: { type: String, required: true } },
  { _id: false },
);

const industryMongoSchema = new Schema<IIndustry>(
  {
    name: { type: translatedFieldSchema, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

industryMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const IndustryModel = model<IIndustry>('Industry', industryMongoSchema);

export const createIndustrySchema = z.object({
  name: z.string().min(1).max(200),
  image: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateIndustryDto = z.infer<typeof createIndustrySchema>;

export const updateIndustrySchema = createIndustrySchema.partial();
export type UpdateIndustryDto = z.infer<typeof updateIndustrySchema>;
