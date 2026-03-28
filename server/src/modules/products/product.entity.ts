import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface ISpecification {
  key: TranslatedField;
  value: TranslatedField;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  description: TranslatedField;
  shortDescription: TranslatedField;
  slug: string;
  sku: string;
  price: number;
  discountPercent?: number;
  category: Types.ObjectId;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  shortDescription: TranslatedField;
  slug: string;
  sku: string;
  price: number;
  discountPercent?: number;
  discountPrice?: number;
  category: string | Record<string, unknown>;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
}

export const toProductResponse = (product: IProduct): ProductResponse => ({
  id: String(product._id),
  name: product.name,
  description: product.description,
  shortDescription: product.shortDescription,
  slug: product.slug,
  sku: product.sku,
  price: product.price,
  discountPercent: product.discountPercent,
  discountPrice: product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : undefined,
  category: product.category && typeof product.category === 'object' && 'name' in product.category
    ? product.category as unknown as Record<string, unknown>
    : String(product.category),
  images: product.images,
  specifications: product.specifications,
  tags: product.tags,
  stock: product.stock,
  isActive: product.isActive,
  isFeatured: product.isFeatured,
  views: product.views,
  createdAt: product.createdAt,
});
