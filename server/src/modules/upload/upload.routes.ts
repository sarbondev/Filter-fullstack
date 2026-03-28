import { Router, Request, Response, NextFunction } from 'express';
import { UploadController } from './upload.controller';
import { upload } from './upload.service';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { AppError } from '../../shared/middleware/error-handler.middleware';

const uploadController = new UploadController();

const router = Router();

// Multer error handler wrapper
const handleMulterError = (
  uploadMiddleware: ReturnType<typeof upload.single> | ReturnType<typeof upload.array>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: unknown) => {
      if (err) {
        if (err instanceof Error && err.message.includes('File too large')) {
          return next(new AppError('File size exceeds 5MB limit', 400));
        }
        if (err instanceof Error) {
          return next(new AppError(err.message, 400));
        }
        return next(new AppError('Upload failed', 500));
      }
      next();
    });
  };
};

// Single file upload
router.post(
  '/single',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  handleMulterError(upload.single('file')),
  asyncHandler(uploadController.single),
);

// Multiple files upload (max 10)
router.post(
  '/multiple',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  handleMulterError(upload.array('files', 10)),
  asyncHandler(uploadController.multiple),
);

// Delete a file
router.delete(
  '/',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(uploadController.delete),
);

export default router;
