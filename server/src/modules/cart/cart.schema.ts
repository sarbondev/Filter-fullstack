import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { ICart } from './cart.entity';

const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const cartMongoSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true, versionKey: false },
);

cartMongoSchema.index({ user: 1 });

export const CartModel = model<ICart>('Cart', cartMongoSchema);

export const addToCartSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});
export type AddToCartDto = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
