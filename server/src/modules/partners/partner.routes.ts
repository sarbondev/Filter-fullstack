import { Router } from 'express';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { PartnerRepository } from './partner.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createPartnerSchema, updatePartnerSchema } from './partner.schema';

const partnerRepository = new PartnerRepository();
const partnerService = new PartnerService(partnerRepository);
const partnerController = new PartnerController(partnerService);

const router = Router();

// Public
router.get('/', asyncHandler(partnerController.getActive));

// Admin
router.get('/all', authenticate, authorize('ADMIN'), asyncHandler(partnerController.getAll));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler(partnerController.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createPartnerSchema }),
  asyncHandler(partnerController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updatePartnerSchema }),
  asyncHandler(partnerController.update),
);
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(partnerController.remove));

export default router;
