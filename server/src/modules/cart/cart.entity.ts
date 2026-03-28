import { Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartResponse {
  id: string;
  user: string;
  items: Array<{
    product: string | Record<string, unknown>;
    quantity: number;
  }>;
  totalItems: number;
  createdAt: Date;
}

export const toCartResponse = (cart: ICart): CartResponse => ({
  id: String(cart._id),
  user: String(cart.user),
  items: cart.items.map((item) => ({
    product: item.product && typeof item.product === 'object' && 'name' in item.product
      ? item.product as unknown as Record<string, unknown>
      : String(item.product),
    quantity: item.quantity,
  })),
  totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  createdAt: cart.createdAt,
});
