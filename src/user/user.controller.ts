import {
  Get,
  Param,
  Inject,
  Request,
  UseGuards,
  Controller,
  NotFoundException
} from "@nestjs/common";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";

@Controller("user")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async getCurrentUser(@Request() req) {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      message: "User retrieved successfully!",
      user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      message: "User retrieved successfully!",
      user
    };
  }
};