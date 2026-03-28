import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "../users/user.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { createUserSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../users/user.schema";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post(
  "/register",
  validate({ body: createUserSchema }),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(authController.login),
);

router.get("/me", authenticate, asyncHandler(authController.me));

router.patch(
  "/profile",
  authenticate,
  validate({ body: updateProfileSchema }),
  asyncHandler(authController.updateProfile),
);

router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema }),
  asyncHandler(authController.changePassword),
);

export default router;
