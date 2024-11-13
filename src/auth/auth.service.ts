import * as bcrypt from "bcrypt";

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "src/user/user.schema";

import { generateOtp } from "utils/generate-otp";
import { extractProvince } from "utils/extract-province";
import { normalizeString } from "utils/normalize-string";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { ContinueWithGoogleDto } from "./dto/continue-with-google.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  async login({ email, password }: LoginDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User does not exist!");
    }

    if (!user.password) {
      throw new ConflictException("This email is registered with Google!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Incorrect password!");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("Email is not verified!");
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.fullname,
      role: user.role,
      ...(user.doctor_id && { doctor_id: user.doctor_id })
    };

    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async register(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException("This email is already registered!");
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new this.userModel({
      ...dto,
      normalizedFullname: normalizeString(dto.fullname),
      role: "user",
      password: hashedPassword,
      province: extractProvince(dto.address),
      otp,
      otpExpires,
      isVerified: false
    });

    await newUser.save();
    await this.sendOtp(newUser.email, otp);

    return newUser;
  }

  async registerAdmin({ email, fullname, password }: RegisterAdminDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      fullname,
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    user.set("gender", undefined, { strict: false });
    await user.save();

    return user;
  }

  async continueWithGoogle({ email, name, image }: ContinueWithGoogleDto) {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({
        email,
        fullname: name,
        normalizedFullname: normalizeString(name),
        role: "user",
        image,
        isVerified: true
      });

      user.set("gender", undefined, { strict: false });
      await user.save();
    }

    const accessToken = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.fullname,
      role: user.role
    });

    return { user, accessToken };
  }

  async resetPassword({ email, newPassword }: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User does not exist!");
    }

    user.set("otp", undefined, { strict: false });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  private clearOtp(user: User) {
    user.set("otp", undefined, { strict: false });
    user.set("otpExpires", undefined, { strict: false });
  }

  async verifyOtp({ email, otp }: VerifyOtpDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Invalid email!");
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException("Invalid OTP!");
    }

    if (new Date() > user.otpExpires) {
      this.clearOtp(user);
      throw new BadRequestException("The OTP has expired! Please request a new one!");
    }

    user.isVerified = true;
    this.clearOtp(user);
    await user.save();
  }

  async sendOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      context: { email, otp },
      template: "./confirmation",
      subject: "Verify your account",
      from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>"
    });
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User does not exist!");
    }

    if (!user.password) {
      throw new ConflictException("This email is registered with Google!");
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();
    await this.sendOtp(email, otp);
  }
};