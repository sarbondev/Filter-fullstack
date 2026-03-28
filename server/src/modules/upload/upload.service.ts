import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '../../shared/utils/logger';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

/**
 * Delete a file from the uploads directory by its URL path.
 * @param fileUrl - e.g. "/uploads/1234567890.jpg"
 */
export function deleteFile(fileUrl: string): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filename = fileUrl.replace('/uploads/', '');
  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info({ filePath }, 'File deleted');
    }
  } catch (err) {
    logger.warn({ filePath, err }, 'Failed to delete file');
  }
}

/**
 * Delete multiple files from the uploads directory.
 */
export function deleteFiles(fileUrls: string[]): void {
  for (const url of fileUrls) {
    deleteFile(url);
  }
}
