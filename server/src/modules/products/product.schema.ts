import { Schema, model } from "mongoose";
import { z } from "zod";
import { IProduct } from "./product.entity";

const translatedFieldSchema = new Schema(
  {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
  },
  { _id: false },
);

const specificationSchema = new Schema(
  {
    key: { type: translatedFieldSchema, required: true },
    value: { type: translatedFieldSchema, required: true },
  },
  { _id: false },
);

const productMongoSchema = new Schema<IProduct>(
  {
    name: { type: translatedFieldSchema, required: true },
    description: { type: translatedFieldSchema, required: true },
    shortDescription: { type: translatedFieldSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    specifications: [specificationSchema],
    tags: { type: translatedFieldSchema },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

productMongoSchema.index({ slug: 1 });
productMongoSchema.index({ sku: 1 });
productMongoSchema.index({ category: 1 });
productMongoSchema.index({ isActive: 1, isFeatured: 1 });
productMongoSchema.index({ price: 1 });
productMongoSchema.index({
  "name.uz": "text",
  "name.ru": "text",
  "name.en": "text",
  "description.en": "text",
});

export const ProductModel = model<IProduct>("Product", productMongoSchema);

// Zod schemas
const specificationInputSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  shortDescription: z.string().min(1).max(500),
  slug: z.string().max(300).optional(),
  sku: z.string().max(50).optional(),
  price: z.number().min(0),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1),
  images: z.array(z.string()).default([]),
  specifications: z.array(specificationInputSchema).default([]),
  tags: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});
export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  isFeatured: z.string().optional(),
  sortBy: z.enum(["price", "createdAt", "views", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
