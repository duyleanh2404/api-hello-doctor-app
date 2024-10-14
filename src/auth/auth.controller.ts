import {
  Res,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  Controller
} from "@nestjs/common";
import { Response } from "express";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { LoginOrRegisterWithGoogleDto } from "./dto/login-or-register-with-google.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }

  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
    return { message: "Registered successfully!" };
  }

  @Post("register-admin")
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    await this.authService.registerAdmin(registerAdminDto);
    return { message: "Registered successfully!" };
  }

  @Post("google")
  async loginOrRegisterWithGoogle(
    @Body() loginOrRegisterWithGoogleDto: LoginOrRegisterWithGoogleDto,
    @Res() response: Response
  ): Promise<void> {
    const result = await this.authService.loginOrRegisterWithGoogle(loginOrRegisterWithGoogleDto);
    const message = result.newUser ? "Registered successfully!" : "Logged in successfully!";

    if (result.newUser) {
      response.status(HttpStatus.CREATED).json({
        message,
        newUser: result.newUser,
        accessToken: result.accessToken
      });
    } else {
      response.status(HttpStatus.OK).json({
        message,
        accessToken: result.accessToken
      });
    }
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    const { accessToken } = await this.authService.login(loginUserDto);
    return {
      message: "Logged in successfully!",
      accessToken
    };
  }

  @Post("verify-otp")
  async verifyOtp(@Body("email") email: string, @Body("otp") otp: string) {
    await this.authService.verifyOtp(email, otp);
    return { message: "OTP verification successful!" }
  }

  @Post("resend-otp")
  async resendOtp(@Body("email") email: string) {
    await this.authService.resendOtp(email);
    return { message: "A new OTP has been sent to your email address!" };
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: "Password reset successfully!" };
  }
};