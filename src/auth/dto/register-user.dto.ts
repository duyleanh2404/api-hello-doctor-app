import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNotEmpty
} from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty({ message: "Email is required!" })
  @IsEmail({}, { message: "Invalid email format!" })
  @IsString({ message: "Email must be a string!" })
  email: string;

  @IsNotEmpty({ message: "Fullname is required!" })
  @IsString({ message: "Fullname must be a string!" })
  fullname: string;

  @IsOptional()
  @IsString({ message: "Address must be a string!" })
  address: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string!" })
  @MinLength(10, { message: "Phone number must be 10 characters long!" })
  @MaxLength(10, { message: "Phone number must be 10 characters long!" })
  phoneNumber: string;

  @IsOptional()
  @IsString({ message: "Date of birth must be a string!" })
  dateOfBirth: string;

  @IsOptional()
  @IsString({ message: "Gender must be a string!" })
  gender: string;

  @IsOptional()
  @IsString({ message: "Password must be a string!" })
  @MinLength(7, { message: "Password must be at least 7 characters long!" })
  password: string;

  @IsOptional()
  @IsString({ message: "Image must be a string if provided!" })
  image?: string;
}