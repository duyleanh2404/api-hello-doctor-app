import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { User } from "./user.schema";
import { GetAllUsersDto } from "./dto/get-all-users.dto";
import { normalizeString } from "utils/normalize-string";
import { UpdateUserDto } from "./dto/update-user.dto";
import { convertImageToBase64 } from "utils/convert-to-base64";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    image?: Express.Multer.File
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
      user.normalizedFullname = normalizeString(updateUserDto.fullname);
    }

    if (updateUserDto.imageName) {
      user.imageName = updateUserDto.imageName;
    }

    if (image) {
      user.image = convertImageToBase64(image);
    }

    if (updateUserDto.gender) {
      user.gender = updateUserDto.gender;
    }

    if (updateUserDto.phoneNumber) {
      user.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.address) {
      user.address = updateUserDto.address;
    }

    if (updateUserDto.dateOfBirth) {
      user.dateOfBirth = updateUserDto.dateOfBirth;
    }

    return user.save();
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    return { message: "User deleted successfully!" };
  }

  async getAllUsers({ page, limit, query, province }: GetAllUsersDto): Promise<{
    users: User[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query || "");

    const filter: any = { role: "user" };

    if (normalizedSearchTerm) {
      filter.normalizedFullname = { $regex: new RegExp(normalizedSearchTerm, "i") };
    }

    if (province && province !== "all") {
      filter.province = province;
    }

    const [users, total] = await Promise.all([
      this.userModel.find(filter).select("-password").skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { users, total };
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select("-password").exec();
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }
};