import * as bcrypt from "bcrypt";
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "src/user/user.schema";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { LoginOrRegisterWithGoogleDto } from "./dto/login-or-register-with-google.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  // User registration with OTP email verification
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException("Email already exist!");
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user object with default role, verification status, and OTP
    const newUser = new this.userModel({
      ...registerUserDto,
      otp,
      role: "user",
      isVerified: false,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send the OTP to the user's email
    await this.sendOtpEmail(newUser.email, otp);

    return newUser;
  }

  // Function to login or register with Google
  async loginOrRegisterWithGoogle(
    loginOrRegisterWithGoogleDto: LoginOrRegisterWithGoogleDto
  ): Promise<{ accessToken: string; newUser?: User }> {
    const { email, name } = loginOrRegisterWithGoogleDto;

    // Check if the user already exists
    let user = await this.userModel.findOne({ email });

    if (!user) {
      // Create a new user
      const newUser = new this.userModel({
        email,
        role: "user",
        fullname: name
      });

      // Generate access token
      const accessToken = this.jwtService.sign({
        id: newUser._id,
        email: newUser.email,
        name: newUser.fullname, // Ensure this matches the correct property
        role: newUser.role,
      });


      // Remove the isVerified field
      newUser.set("isVerified", undefined, { strict: false });

      // Save the new user to the database
      await newUser.save();

      return { accessToken, newUser };
    }

    // User already exists; generate access token
    const accessToken = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.fullname, // Ensure this matches the correct property
      role: user.role,
    });

    return { accessToken };
  }

  // Function to send OTP via email using MailerService
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>", // Email sender's address
      to: email,
      subject: "Xác thực tài khoản của bạn", // Email subject in Vietnamese (OTP verification)
      template: "./confirmation", // Email template
      context: { email, otp }, // Context variables to inject into the template
    });
  }

  // Function to verify the OTP sent to the user's email
  async verifyOtp(email: string, otp: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Invalid email!"); // Error if user not found
    }

    if (user.otp !== otp) {
      throw new BadRequestException("Invalid OTP!"); // Error if OTP does not match
    }

    // If OTP is correct, mark the user as verified and remove the OTP field completely
    user.isVerified = true;
    user.set("otp", undefined, { strict: false }); // Remove the otp field

    await user.save();
  }

  // Resend OTP to the user in case they did not receive it
  async resendOtp(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    // Check if the user does not exist
    if (!user) {
      throw new BadRequestException({
        message: "User does not exist!",
        errorCode: "USER_NOT_FOUND"
      });
    }

    // Check if the user has registered using Google
    if (!user.password) {
      throw new BadRequestException({
        message: "This email is registered with Google. Please log in with Google!",
        errorCode: "GOOGLE_LOGIN_REQUIRED"
      });
    }

    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the user with the new OTP
    user.otp = otp;
    await user.save();

    // Send the new OTP via email
    await this.sendOtpEmail(email, otp);
  }

  // User login with email and password validation
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    // Find the user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        message: "User does not exist!",
        errorCode: "USER_NOT_FOUND"
      });
    }

    // Check if the user has registered using Google
    if (!user.password) {
      throw new UnauthorizedException({
        message: "This email is registered with Google. Please log in with Google!",
        errorCode: "GOOGLE_LOGIN_REQUIRED"
      });
    }

    // Check if the user's email has been verified
    if (!user.isVerified) {
      throw new UnauthorizedException({
        message: "Email is not verified. Please verify your email with the OTP sent!",
        errorCode: "EMAIL_NOT_VERIFIED"
      });
    }

    // Validate the user's password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: "Incorrect password",
        errorCode: "INVALID_PASSWORD"
      });
    }

    // Generate a JWT token for the user containing the user ID, email, and role
    const accessToken = this.jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return { accessToken }; // Return the access token for authentication
  }

  // Reset password function to verify OTP and update the password
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, newPassword } = resetPasswordDto;

    // Check if the user exists by email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Email does not exist!");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the OTP field
    user.password = hashedPassword;
    user.set("otp", undefined, { strict: false }); // Remove the OTP after successful verification

    await user.save();
  }
};