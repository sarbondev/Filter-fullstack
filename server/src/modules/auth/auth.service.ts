import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/user.repository";
import { toUserResponse, UserResponse } from "../users/user.entity";
import { CreateUserDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from "../users/user.schema";
import { env } from "../../config/env";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../../shared/middleware/error-handler.middleware";
import { JwtPayload } from "../../shared/types/common.types";
import { logger } from "../../shared/utils/logger";

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const exists = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
    if (exists)
      throw new ConflictError("User with this phone number already exists");

    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.userRepository.create({ ...dto, password });

    logger.info(
      { userId: String(user._id), phoneNumber: user.phoneNumber },
      "User registered",
    );
    return {
      user: toUserResponse(user),
      accessToken: this.signToken(
        String(user._id),
        user.phoneNumber,
        user.role,
      ),
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // password select: false — shuning uchun maxsus method
    const user = await this.userRepository.findByPhoneNumberWithPassword(
      dto.phoneNumber,
    );
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    logger.info({ userId: String(user._id) }, "User logged in");
    return {
      user: toUserResponse(user),
      accessToken: this.signToken(
        String(user._id),
        user.phoneNumber,
        user.role,
      ),
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponse> {
    if (dto.phoneNumber) {
      const existing = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
      if (existing && String(existing._id) !== userId) {
        throw new ConflictError("This phone number is already in use");
      }
    }
    const updated = await this.userRepository.update(userId, dto);
    if (!updated) throw new NotFoundError("User");
    return toUserResponse(updated);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) throw new NotFoundError("User");

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedError("Current password is incorrect");

    const password = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepository.update(userId, { password });
  }

  private signToken(sub: string, phoneNumber: string, role: string): string {
    const payload: JwtPayload = { sub, phoneNumber, role };
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }
}
