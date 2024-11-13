import { Post, Body, Query, Inject, Controller } from "@nestjs/common";

import { User } from "src/user/user.schema";
import { AuthService } from "./auth.service";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { ContinueWithGoogleDto } from "./dto/continue-with-google.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() dto: LoginDto): Promise<{ message: string; user: User, accessToken: string }> {
    const { user, accessToken } = await this.authService.login(dto);
    return { message: "Logged in successfully!", user, accessToken };
  }

  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    await this.authService.register(dto);
    return { message: "Registered successfully!" };
  }

  @Post("register-admin")
  async registerAdmin(@Body() dto: RegisterAdminDto): Promise<{ message: string }> {
    await this.authService.registerAdmin(dto);
    return { message: "Admin registered successfully!" };
  }

  @Post("google")
  async continueWithGoogle(@Body() dto: ContinueWithGoogleDto): Promise<{
    message: string, user: User, accessToken: string
  }> {
    const { user, accessToken } = await this.authService.continueWithGoogle(dto);
    return { message: "Google authentication completed successfully!", user, accessToken };
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: "Password reset successfully!" };
  }

  @Post("resend-otp")
  async resendOtp(@Query("email") email: string): Promise<{ message: string }> {
    await this.authService.resendOtp(email);
    return { message: "OTP resent successfully! Please check your email." };
  }

  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<{ message: string }> {
    await this.authService.verifyOtp(dto);
    return { message: "OTP verified successfully!" };
  }
};