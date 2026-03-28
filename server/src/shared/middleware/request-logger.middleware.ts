import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();
  res.on("finish", () => {
    const data = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
    };
    if (res.statusCode >= 500) logger.error(data, "Request error");
    else if (res.statusCode >= 400) logger.warn(data, "Request warning");
    else logger.info(data, "Request");
  });
  next();
};
