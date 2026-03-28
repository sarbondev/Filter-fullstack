import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface IBanner extends Document {
  _id: Types.ObjectId;
  title: TranslatedField;
  subtitle: TranslatedField;
  image: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerResponse {
  id: string;
  title: TranslatedField;
  subtitle: TranslatedField;
  image: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export const toBannerResponse = (banner: IBanner): BannerResponse => ({
  id: String(banner._id),
  title: banner.title,
  subtitle: banner.subtitle,
  image: banner.image,
  link: banner.link,
  isActive: banner.isActive,
  sortOrder: banner.sortOrder,
  startDate: banner.startDate,
  endDate: banner.endDate,
  createdAt: banner.createdAt,
});
