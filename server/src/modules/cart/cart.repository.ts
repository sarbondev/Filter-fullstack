import { CartModel } from './cart.schema';
import { ICart } from './cart.entity';

export class CartRepository {
  async findByUser(userId: string): Promise<ICart | null> {
    return CartModel.findOne({ user: userId })
      .populate('items.product', 'name slug images price discountPrice stock isActive')
      .lean<ICart>();
  }

  async findOrCreate(userId: string): Promise<ICart> {
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
      await cart.save();
    }
    return CartModel.findById(cart._id)
      .populate('items.product', 'name slug images price discountPrice stock isActive')
      .lean<ICart>() as Promise<ICart>;
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      const newCart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
      });
      await newCart.save();
      return CartModel.findById(newCart._id)
        .populate('items.product', 'name slug images price discountPrice stock isActive')
        .lean<ICart>() as Promise<ICart>;
    }

    const existingItem = cart.items.find((item) => String(item.product) === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId as any, quantity });
    }
    await cart.save();

    return CartModel.findById(cart._id)
      .populate('items.product', 'name slug images price discountPrice stock isActive')
      .lean<ICart>() as Promise<ICart>;
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<ICart | null> {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    await CartModel.updateOne(
      { user: userId, 'items.product': productId },
      { $set: { 'items.$.quantity': quantity } },
    );

    return CartModel.findOne({ user: userId })
      .populate('items.product', 'name slug images price discountPrice stock isActive')
      .lean<ICart>();
  }

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    await CartModel.updateOne(
      { user: userId },
      { $pull: { items: { product: productId } } },
    );

    return CartModel.findOne({ user: userId })
      .populate('items.product', 'name slug images price discountPrice stock isActive')
      .lean<ICart>();
  }

  async clear(userId: string): Promise<void> {
    await CartModel.updateOne({ user: userId }, { $set: { items: [] } });
  }
}
