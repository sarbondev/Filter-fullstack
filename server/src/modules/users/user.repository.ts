import { UserModel } from "./user.schema";
import { IUser } from "./user.entity";
import { CreateUserDto } from "./user.schema";

export class UserRepository {
  async create(data: CreateUserDto & { password: string }): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean<IUser>();
  }

  // select: false ni bypass qilish uchun +password
  async findByPhoneNumberWithPassword(
    phoneNumber: string,
  ): Promise<IUser | null> {
    return UserModel.findOne({ phoneNumber }).select("+password").lean<IUser>();
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("+password").lean<IUser>();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return UserModel.findOne({ phoneNumber }).lean<IUser>();
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find().sort({ createdAt: -1 }).lean<IUser[]>();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean<IUser>();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
