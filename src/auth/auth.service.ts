import * as bcrypt from "bcrypt";
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException
} from "@nestjs/common";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "src/user/user.schema";
import { LoginUserDto } from "./dto/login-user.dto";
import { extractProvince } from "utils/extract-province";
import { normalizeString } from "utils/normalize-string";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { LoginOrRegisterWithGoogleDto } from "./dto/login-or-register-with-google.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException({
        errorCode: "EMAIL_ALREADY_EXISTS",
        message: "This email is already registered!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new this.userModel({
      ...registerUserDto,
      otp,
      role: "user",
      isVerified: false,
      password: hashedPassword,
      province: extractProvince(registerUserDto.address),
      normalizedFullname: normalizeString(registerUserDto.fullname)
    });

    await newUser.save();
    await this.sendOtpEmail(newUser.email, otp);

    return newUser;
  }

  async registerAdmin({ email, fullname, password }: RegisterAdminDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new this.userModel({
      email,
      fullname,
      role: "admin",
      password: hashedPassword
    });

    admin.set("gender", undefined, { strict: false });
    admin.set("isVerified", undefined, { strict: false });
    await admin.save();

    return admin;
  }

  async loginOrRegisterWithGoogle({ email, name }: LoginOrRegisterWithGoogleDto): Promise<{
    accessToken: string; newUser?: User
  }> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      const newUser = new this.userModel({
        email,
        role: "user",
        fullname: name
      });

      const accessToken = this.jwtService.sign({
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        name: newUser.fullname
      });

      newUser.set("isVerified", undefined, { strict: false });
      await newUser.save();

      return { accessToken, newUser };
    }

    const accessToken = this.jwtService.sign({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.fullname
    });

    return { accessToken };
  }

  async sendOtpEmail(email: string, otp: string) {
    await this.mailerService.sendMail({
      from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>",
      to: email,
      subject: "Xác thực tài khoản của bạn",
      template: "./confirmation",
      context: { email, otp }
    });
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        errorCode: "INVALID_EMAIL",
        message: "Invalid email!"
      });
    }

    if (user.otp !== otp) {
      throw new BadRequestException({
        errorCode: "INVALID_OTP",
        message: "Invalid OTP!"
      });
    }

    user.isVerified = true;
    user.set("otp", undefined, { strict: false });

    await user.save();
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        errorCode: "USER_NOT_FOUND",
        message: "User does not exist!"
      });
    }

    if (!user.password) {
      throw new BadRequestException({
        errorCode: "GOOGLE_LOGIN_REQUIRED",
        message: "This email is registered with Google. Please log in with Google!"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;

    await user.save();
    await this.sendOtpEmail(email, otp);
  }

  async login({ email, password }: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException({
        errorCode: "USER_NOT_FOUND",
        message: "User does not exist!"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        errorCode: "INVALID_PASSWORD",
        message: "Incorrect password!"
      });
    }

    if (!user.password) {
      throw new UnauthorizedException({
        errorCode: "GOOGLE_LOGIN_REQUIRED",
        message: "This email is registered with Google. Please log in with Google!"
      });
    }

    if (user.isVerified === false) {
      throw new UnauthorizedException({
        errorCode: "EMAIL_NOT_VERIFIED",
        message: "Email is not verified. Please verify your email with the OTP sent!"
      });
    }

    const accessToken = this.jwtService.sign({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.fullname
    });

    return { accessToken };
  }

  async resetPassword({ email, newPassword }: ResetPasswordDto): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User does not exist!");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.set("otp", undefined, { strict: false });

    await user.save();
  }
};