import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IBanner } from './banner.entity';

const translatedFieldSchema = new Schema(
  { uz: { type: String, required: true }, ru: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false },
);

const bannerMongoSchema = new Schema<IBanner>(
  {
    title: { type: translatedFieldSchema, required: true },
    subtitle: { type: translatedFieldSchema, required: true },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

bannerMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const BannerModel = model<IBanner>('Banner', bannerMongoSchema);

export const createBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(500),
  image: z.string().min(1),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type CreateBannerDto = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerDto = z.infer<typeof updateBannerSchema>;
