import { CartRepository } from './cart.repository';
import { CartResponse, toCartResponse } from './cart.entity';
import { AddToCartDto, UpdateCartItemDto } from './cart.schema';
import { NotFoundError, AppError } from '../../shared/middleware/error-handler.middleware';
import { ProductRepository } from '../products/product.repository';

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getCart(userId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.findOrCreate(userId);
    return toCartResponse(cart);
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<CartResponse> {
    const product = await this.productRepository.findById(dto.product);
    if (!product) throw new NotFoundError('Product');
    if (!product.isActive) throw new AppError('Product is not available', 400);
    if (product.stock < dto.quantity) throw new AppError('Insufficient stock', 400);

    const cart = await this.cartRepository.addItem(userId, dto.product, dto.quantity);
    return toCartResponse(cart);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<CartResponse> {
    if (dto.quantity > 0) {
      const product = await this.productRepository.findById(productId);
      if (!product) throw new NotFoundError('Product');
      if (product.stock < dto.quantity) throw new AppError('Insufficient stock', 400);
    }

    const cart = await this.cartRepository.updateItemQuantity(userId, productId, dto.quantity);
    if (!cart) throw new NotFoundError('Cart');
    return toCartResponse(cart);
  }

  async removeItem(userId: string, productId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.removeItem(userId, productId);
    if (!cart) throw new NotFoundError('Cart');
    return toCartResponse(cart);
  }

  async clear(userId: string): Promise<void> {
    await this.cartRepository.clear(userId);
  }
}
