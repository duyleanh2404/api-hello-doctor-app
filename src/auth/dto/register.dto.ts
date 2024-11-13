import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  password: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  image: string;
};