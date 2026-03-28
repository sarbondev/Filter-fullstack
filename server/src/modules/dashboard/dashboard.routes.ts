import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';

const dashboardController = new DashboardController();

const router = Router();

router.get(
  '/stats',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(dashboardController.getStats),
);

export default router;
