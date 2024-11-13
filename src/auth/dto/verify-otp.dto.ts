import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
};