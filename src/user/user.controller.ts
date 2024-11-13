import {
  Get, Put, Body, Query, Param, Delete, Inject, Request, UseGuards,
  Controller, UploadedFile, UseInterceptors, NotFoundException
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { User } from "./user.schema";
import { UserService } from "./user.service";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { EditUserDto } from "./dto/edit-user.dto";
import { GetAllUsersDto } from "./dto/get-all-users.dto";

@Controller("user")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) { }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user", "doctor")
  @UseInterceptors(FileInterceptor("image"))
  async editUser(
    @Param("id") id: string, @Body() dto: EditUserDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string }> {
    await this.userService.editUser(id, dto, image);
    return { message: "User updated successfully!" };
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
  @Roles("admin", "user", "doctor")
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
  async getAllUsers(@Query() dto: GetAllUsersDto): Promise<{
    message: string; total: number; users: User[]
  }> {
    const { users, total } = await this.userService.getAllUsers(dto);

    return {
      message: "Users retrieved successfully!",
      total,
      users
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async getById(@Param("id") id: string): Promise<{ message: string; user: User }> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    return {
      message: "User retrieved successfully!",
      user
    };
  }
};