import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IBanner } from './banner.entity';

const bannerMongoSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

bannerMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const BannerModel = model<IBanner>('Banner', bannerMongoSchema);

export const createBannerSchema = z.object({
  image: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateBannerDto = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerDto = z.infer<typeof updateBannerSchema>;
