import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/common.types';

export class ResponseHelper {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): Response {
    const body: ApiResponse<T> = { success: true, message, data };
    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data: T, message = 'Created'): Response {
    return this.success(res, data, message, 201);
  }

  static paginated<T>(res: Response, result: PaginatedResponse<T>, message = 'Success'): Response {
    return res.status(200).json({
      success: true,
      message,
      data: result.data,
      meta: result.meta,
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
