import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: TranslatedField;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  user: string | Record<string, unknown>;
  product: string | Record<string, unknown>;
  rating: number;
  comment: TranslatedField;
  isApproved: boolean;
  createdAt: Date;
}

export const toReviewResponse = (review: IReview): ReviewResponse => ({
  id: String(review._id),
  user: review.user && typeof review.user === 'object' && 'name' in review.user
    ? review.user as unknown as Record<string, unknown>
    : String(review.user),
  product: review.product && typeof review.product === 'object' && 'name' in review.product
    ? review.product as unknown as Record<string, unknown>
    : String(review.product),
  rating: review.rating,
  comment: review.comment,
  isApproved: review.isApproved,
  createdAt: review.createdAt,
});
