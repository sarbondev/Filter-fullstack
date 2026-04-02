import { Document, Types } from 'mongoose';

export interface IPartner extends Document {
  _id: Types.ObjectId;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerResponse {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toPartnerResponse = (partner: IPartner): PartnerResponse => ({
  id: String(partner._id),
  image: partner.image,
  isActive: partner.isActive,
  sortOrder: partner.sortOrder,
  createdAt: partner.createdAt,
});
