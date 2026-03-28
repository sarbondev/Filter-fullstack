import { Router } from 'express';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { ProductRepository } from '../products/product.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { addToCartSchema, updateCartItemSchema } from './cart.schema';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const cartService = new CartService(cartRepository, productRepository);
const cartController = new CartController(cartService);

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(cartController.getCart as any));
router.post('/', validate({ body: addToCartSchema }), asyncHandler(cartController.addItem as any));
router.patch(
  '/:productId',
  validate({ body: updateCartItemSchema }),
  asyncHandler(cartController.updateItem as any),
);
router.delete('/:productId', asyncHandler(cartController.removeItem as any));
router.delete('/', asyncHandler(cartController.clear as any));

export default router;
