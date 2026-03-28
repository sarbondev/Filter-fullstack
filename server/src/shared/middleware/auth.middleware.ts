import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthRequest, JwtPayload } from "../types/common.types";
import { UnauthorizedError, ForbiddenError } from "./error-handler.middleware";

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }
  try {
    const token = authHeader.split(" ")[1]!;
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role))
      throw new ForbiddenError("Insufficient permissions");
    next();
  };
