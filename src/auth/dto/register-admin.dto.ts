import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  password: string;
};