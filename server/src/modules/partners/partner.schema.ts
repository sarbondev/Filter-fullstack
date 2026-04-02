import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IPartner } from './partner.entity';

const partnerMongoSchema = new Schema<IPartner>(
  {
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

partnerMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const PartnerModel = model<IPartner>('Partner', partnerMongoSchema);

export const createPartnerSchema = z.object({
  image: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreatePartnerDto = z.infer<typeof createPartnerSchema>;

export const updatePartnerSchema = createPartnerSchema.partial();
export type UpdatePartnerDto = z.infer<typeof updatePartnerSchema>;
