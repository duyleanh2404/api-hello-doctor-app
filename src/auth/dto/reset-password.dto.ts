import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
};