import { Document, Types } from "mongoose";

export type UserRole = "ADMIN" | "CALL_MANAGER" | "CLIENT";

export interface IUser extends Document {
  _id: Types.ObjectId;
  phoneNumber: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export const toUserResponse = (user: IUser): UserResponse => ({
  id: String(user._id),
  phoneNumber: user.phoneNumber,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt,
});
