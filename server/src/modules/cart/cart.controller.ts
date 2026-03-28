import { Response } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './cart.schema';
import { ResponseHelper } from '../../shared/utils/api-response';
import { AuthRequest } from '../../shared/types/common.types';

export class CartController {
  constructor(private readonly cartService: CartService) {}

  getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.cartService.getCart(req.user!.sub);
    ResponseHelper.success(res, cart, 'Cart retrieved');
  };

  addItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.cartService.addItem(req.user!.sub, req.body as AddToCartDto);
    ResponseHelper.success(res, cart, 'Item added to cart');
  };

  updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.cartService.updateItem(
      req.user!.sub,
      req.params['productId']! as string,
      req.body as UpdateCartItemDto,
    );
    ResponseHelper.success(res, cart, 'Cart item updated');
  };

  removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.cartService.removeItem(req.user!.sub, req.params['productId']! as string);
    ResponseHelper.success(res, cart, 'Item removed from cart');
  };

  clear = async (req: AuthRequest, res: Response): Promise<void> => {
    await this.cartService.clear(req.user!.sub);
    ResponseHelper.noContent(res);
  };
}
