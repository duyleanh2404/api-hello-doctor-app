import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty
} from "class-validator";

export class RegisterAdminDto {
  @IsNotEmpty({ message: "Email is required!" })
  @IsEmail({}, { message: "Invalid email format!" })
  @IsString({ message: "Email must be a string!" })
  email: string;

  @IsNotEmpty({ message: "Fullname is required!" })
  @IsString({ message: "Fullname must be a string!" })
  fullname: string;

  @IsNotEmpty({ message: "Password is required!" })
  @IsString({ message: "Password must be a string!" })
  @MinLength(7, { message: "Password must be at least 7 characters long!" })
  password: string;
};