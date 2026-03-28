import { Router } from 'express';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createBlogSchema, updateBlogSchema } from './blog.schema';

const blogRepository = new BlogRepository();
const blogService = new BlogService(blogRepository);
const blogController = new BlogController(blogService);

const router = Router();

// Public
router.get('/', asyncHandler(blogController.getPublished));
router.get('/slug/:slug', asyncHandler(blogController.getBySlug));

// Admin
router.get('/admin/all', authenticate, authorize('ADMIN'), asyncHandler(blogController.getAll));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler(blogController.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createBlogSchema }),
  asyncHandler(blogController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updateBlogSchema }),
  asyncHandler(blogController.update),
);
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(blogController.remove));

export default router;
