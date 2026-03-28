import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: TranslatedField;
  content: TranslatedField;
  excerpt: TranslatedField;
  slug: string;
  image?: string;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogResponse {
  id: string;
  title: TranslatedField;
  content: TranslatedField;
  excerpt: TranslatedField;
  slug: string;
  image?: string;
  isPublished: boolean;
  views: number;
  createdAt: Date;
}

export const toBlogResponse = (blog: IBlog): BlogResponse => ({
  id: String(blog._id),
  title: blog.title,
  content: blog.content,
  excerpt: blog.excerpt,
  slug: blog.slug,
  image: blog.image,
  isPublished: blog.isPublished,
  views: blog.views,
  createdAt: blog.createdAt,
});
