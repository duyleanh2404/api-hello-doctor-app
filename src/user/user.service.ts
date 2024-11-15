import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { User } from "./user.schema";

import { normalizeString } from "utils/normalize-string";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { EditUserDto } from "./dto/edit-user.dto";
import { GetAllUsersDto } from "./dto/get-all-users.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async editUser(id: string, dto: EditUserDto, image?: Express.Multer.File) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    if (image) user.image = convertImageToBase64(image);
    if (dto.fullname) user.normalizedFullname = normalizeString(dto.fullname);

    Object.entries(dto).forEach(([key, value]) => {
      if (value) user[key] = value;
    });

    await user.save();
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException("User not found!");
    }
  }

  async getAllUsers({ page, limit, query, province }: GetAllUsersDto): Promise<{
    users: User[]; total: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: any = { role: "user" };

    if (query) {
      const normalizedSearchTerm = normalizeString(query);
      filter.normalizedFullname = { $regex: new RegExp(normalizedSearchTerm, "i") };
    }

    if (province && province !== "all") {
      filter.province = province;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select("fullname dateOfBirth gender address phoneNumber")
        .exec(),
      this.userModel.countDocuments(filter).exec()
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