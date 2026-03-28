import { Request, Response } from 'express';
import { ResponseHelper } from '../../shared/utils/api-response';
import { AppError } from '../../shared/middleware/error-handler.middleware';
import { getFileUrl, deleteFile } from './upload.service';

export class UploadController {
  /** Upload a single image */
  single = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    const url = getFileUrl(req.file.filename);
    ResponseHelper.success(res, { url, filename: req.file.filename, size: req.file.size }, 'File uploaded');
  };

  /** Upload multiple images (max 10) */
  multiple = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }
    const uploads = files.map((file) => ({
      url: getFileUrl(file.filename),
      filename: file.filename,
      size: file.size,
    }));
    ResponseHelper.success(res, uploads, `${uploads.length} file(s) uploaded`);
  };

  /** Delete a single file */
  delete = async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body as { url?: string };
    if (!url) {
      throw new AppError('URL is required', 400);
    }
    deleteFile(url);
    ResponseHelper.success(res, null, 'File deleted');
  };
}
