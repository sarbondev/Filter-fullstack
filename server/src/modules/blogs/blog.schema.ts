import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IBlog } from './blog.entity';

const translatedFieldSchema = new Schema(
  { uz: { type: String, required: true }, ru: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false },
);

const blogMongoSchema = new Schema<IBlog>(
  {
    title: { type: translatedFieldSchema, required: true },
    content: { type: translatedFieldSchema, required: true },
    excerpt: { type: translatedFieldSchema, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

blogMongoSchema.index({ slug: 1 });
blogMongoSchema.index({ isPublished: 1, createdAt: -1 });

export const BlogModel = model<IBlog>('Blog', blogMongoSchema);

export const createBlogSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(50000),
  image: z.string().min(1).optional(),
  isPublished: z.boolean().default(false),
});
export type CreateBlogDto = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = createBlogSchema.partial();
export type UpdateBlogDto = z.infer<typeof updateBlogSchema>;
