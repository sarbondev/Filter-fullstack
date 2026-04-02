import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IReview } from './review.entity';

const translatedFieldSchema = new Schema(
  { uz: { type: String, required: true }, ru: { type: String, required: true }, en: { type: String, required: true }, kz: { type: String, required: true } },
  { _id: false },
);

const reviewMongoSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: translatedFieldSchema, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

reviewMongoSchema.index({ product: 1, createdAt: -1 });
reviewMongoSchema.index({ user: 1 });
reviewMongoSchema.index({ isApproved: 1 });

export const ReviewModel = model<IReview>('Review', reviewMongoSchema);

export const createReviewSchema = z.object({
  product: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});
export type CreateReviewDto = z.infer<typeof createReviewSchema>;
