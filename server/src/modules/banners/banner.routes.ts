import { Router } from 'express';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerRepository } from './banner.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createBannerSchema, updateBannerSchema } from './banner.schema';

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);
const bannerController = new BannerController(bannerService);

const router = Router();

// Public
router.get('/', asyncHandler(bannerController.getActive));

// Admin
router.get('/all', authenticate, authorize('ADMIN'), asyncHandler(bannerController.getAll));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler(bannerController.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createBannerSchema }),
  asyncHandler(bannerController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updateBannerSchema }),
  asyncHandler(bannerController.update),
);
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(bannerController.remove));

export default router;
