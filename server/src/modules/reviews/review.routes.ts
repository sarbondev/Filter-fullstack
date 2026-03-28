import { Router } from 'express';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createReviewSchema } from './review.schema';

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

const router = Router();

// Public
router.get('/product/:productId', asyncHandler(reviewController.getByProduct));

// Authenticated
router.post(
  '/',
  authenticate,
  validate({ body: createReviewSchema }),
  asyncHandler(reviewController.create as any),
);
router.get('/my', authenticate, asyncHandler(reviewController.getMyReviews as any));

// Admin
router.get('/', authenticate, authorize('ADMIN', 'CALL_MANAGER'), asyncHandler(reviewController.getAll));
router.patch('/:id/approve', authenticate, authorize('ADMIN', 'CALL_MANAGER'), asyncHandler(reviewController.approve));
router.delete('/:id', authenticate, authorize('ADMIN', 'CALL_MANAGER'), asyncHandler(reviewController.remove));

export default router;
