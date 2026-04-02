import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface IIndustry extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndustryResponse {
  id: string;
  name: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toIndustryResponse = (industry: IIndustry): IndustryResponse => ({
  id: String(industry._id),
  name: industry.name,
  image: industry.image,
  isActive: industry.isActive,
  sortOrder: industry.sortOrder,
  createdAt: industry.createdAt,
});
