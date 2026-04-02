import { Router } from 'express';
import { IndustryController } from './industry.controller';
import { IndustryService } from './industry.service';
import { IndustryRepository } from './industry.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createIndustrySchema, updateIndustrySchema } from './industry.schema';

const industryRepository = new IndustryRepository();
const industryService = new IndustryService(industryRepository);
const industryController = new IndustryController(industryService);

const router = Router();

// Public
router.get('/', asyncHandler(industryController.getActive));

// Admin
router.get('/all', authenticate, authorize('ADMIN'), asyncHandler(industryController.getAll));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler(industryController.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createIndustrySchema }),
  asyncHandler(industryController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updateIndustrySchema }),
  asyncHandler(industryController.update),
);
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(industryController.remove));

export default router;
