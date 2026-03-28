import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Error as MongooseError } from "mongoose";
import { logger } from "../utils/logger";

// ─── Custom Error Classes ─────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} already exists`, 409);
  }
}

// ─── Global Error Handler ─────────────────────────────────────────────────────

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // 1. Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // 2. Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    res
      .status(422)
      .json({ success: false, message: "Validation failed", errors });
    return;
  }

  // 3. Mongoose duplicate key (E11000)
  if (
    (err as NodeJS.ErrnoException).name === "MongoServerError" &&
    (err as { code?: number }).code === 11000
  ) {
    const keyValue =
      (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? "field";
    res
      .status(409)
      .json({ success: false, message: `Duplicate value for field: ${field}` });
    return;
  }

  // 4. Mongoose CastError (invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    res
      .status(400)
      .json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
    return;
  }

  // 5. Operational (known) errors
  if (err instanceof AppError) {
    logger.warn(
      { err, path: req.path, method: req.method },
      "Operational error",
    );
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // 6. Unknown errors
  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
  res.status(500).json({
    success: false,
    message:
      process.env["NODE_ENV"] === "production"
        ? "Internal server error"
        : err.message,
  });
};

// ─── Async Wrapper ────────────────────────────────────────────────────────────

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
