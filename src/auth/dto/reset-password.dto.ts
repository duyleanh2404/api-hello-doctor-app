import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "Email is required!" })
  @IsEmail({}, { message: "Invalid email format!" })
  @IsString({ message: "Email must be a string!" })
  email: string;

  @IsNotEmpty({ message: "New password is required!" })
  @IsString({ message: "New password must be a string!" })
  newPassword: string;
};