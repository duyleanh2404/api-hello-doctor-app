import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty({ message: "Email is required!" })
  @IsEmail({}, { message: "Invalid email format!" })
  @IsString({ message: "Email must be a string!" })
  email: string;

  @IsNotEmpty({ message: "Password is required!" })
  @IsString({ message: "Password must be a string!" })
  password: string;
};