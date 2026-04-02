import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { ICategory } from './category.entity';

const translatedFieldSchema = new Schema(
  { uz: { type: String, required: true }, ru: { type: String, required: true }, en: { type: String, required: true }, kz: { type: String, required: true } },
  { _id: false },
);

const categoryMongoSchema = new Schema<ICategory>(
  {
    name: { type: translatedFieldSchema, required: true },
    description: { type: translatedFieldSchema, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

categoryMongoSchema.index({ slug: 1 });
categoryMongoSchema.index({ parent: 1 });
categoryMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const CategoryModel = model<ICategory>('Category', categoryMongoSchema);

// Zod schemas
export const createCategorySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  image: z.string().min(1).optional(),
  parent: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
