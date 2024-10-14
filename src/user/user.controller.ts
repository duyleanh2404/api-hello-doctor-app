import {
  Get,
  Param,
  Inject,
  Request,
  UseGuards,
  Controller,
  NotFoundException
} from "@nestjs/common";

import { User } from "./user.schema";
import { UserService } from "./user.service";
import { Roles } from "src/auth/passport/roles.decorator";
import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

@Controller("user")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) { }

  @Get("/me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getCurrentUser(@Request() req): Promise<{ message: string; user: User }> {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      message: "User retrieved successfully!",
      user
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async findById(@Param("id") id: string): Promise<{ message: string; user: User }> {
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