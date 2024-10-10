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
import { LoginOrRegisterWithGoogleDto } from "./dto/login-or-register-with-google.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }

  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
    return { message: "Registration successful!" };
  }

  @Post("login-or-register-with-google")
  async loginOrRegisterWithGoogle(
    @Body() loginOrRegisterWithGoogleDto: LoginOrRegisterWithGoogleDto,
    @Res() response: Response
  ): Promise<void> {
    const result = await this.authService.loginOrRegisterWithGoogle(loginOrRegisterWithGoogleDto);

    const message = result.newUser ? "Registration successful!" : "Login successful!";

    if (result.newUser) {
      response.status(HttpStatus.CREATED).json({
        message,
        accessToken: result.accessToken,
        newUser: result.newUser
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
      message: "Login successful!",
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
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: "Password reset successfully!" };
  }
};