import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createProductSchema, updateProductSchema } from './product.schema';

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

// Public routes
router.get('/', asyncHandler(productController.getAll));
router.get('/slug/:slug', asyncHandler(productController.getBySlug));

// Admin routes
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(productController.getAllAdmin),
);

// Parameterized route must come after /slug/:slug and /admin/all
router.get('/:id', asyncHandler(productController.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createProductSchema }),
  asyncHandler(productController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updateProductSchema }),
  asyncHandler(productController.update),
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(productController.remove),
);

export default router;
