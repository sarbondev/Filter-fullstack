import { Document, Types } from 'mongoose';

export interface IBanner extends Document {
  _id: Types.ObjectId;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerResponse {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toBannerResponse = (banner: IBanner): BannerResponse => ({
  id: String(banner._id),
  image: banner.image,
  isActive: banner.isActive,
  sortOrder: banner.sortOrder,
  createdAt: banner.createdAt,
});
