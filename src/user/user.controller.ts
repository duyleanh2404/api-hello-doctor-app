import {
  Get,
  Param,
  Inject,
  Request,
  UseGuards,
  Controller,
  NotFoundException,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { User } from "./user.schema";
import { UserService } from "./user.service";
import { GetAllUsersDto } from "./dto/get-all-users.dto";
import { Roles } from "src/auth/passport/roles.decorator";
import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) { }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async updateUser(
    @Param("id") id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<{ message: string; user: User }> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto, image);
    return {
      message: "User updated successfully!",
      user: updatedUser
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteUser(@Param("id") id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: "User deleted successfully!" };
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getCurrentUser(@Request() req): Promise<{ message: string; user: User }> {
    const user = await this.userService.getById(req.user.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      message: "User retrieved successfully!",
      user
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getAllUsers(@Query() getAllUsersDto: GetAllUsersDto): Promise<{
    message: string; total: number; users: User[]
  }> {
    const { users, total } = await this.userService.getAllUsers(getAllUsersDto);
    return {
      message: "Users retrieved successfully!",
      total,
      users
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getById(@Param("id") id: string): Promise<{ message: string; user: User }> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      message: "User retrieved successfully!",
      user
    };
  }
};