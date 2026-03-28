import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from "../users/user.schema";
import { ResponseHelper } from "../../shared/utils/api-response";
import { AuthRequest } from "../../shared/types/common.types";
import { UnauthorizedError } from "../../shared/middleware/error-handler.middleware";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body as CreateUserDto);
    ResponseHelper.created(res, result, "Registration successful");
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body as LoginDto);
    ResponseHelper.success(res, result, "Login successful");
  };

  me = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ResponseHelper.success(res, req.user, "Current user");
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const result = await this.authService.updateProfile(req.user.sub, req.body as UpdateProfileDto);
    ResponseHelper.success(res, result, "Profile updated");
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.authService.changePassword(req.user.sub, req.body as ChangePasswordDto);
    ResponseHelper.success(res, null, "Password changed successfully");
  };
}
