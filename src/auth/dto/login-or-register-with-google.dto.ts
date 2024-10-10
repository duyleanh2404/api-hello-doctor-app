import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginOrRegisterWithGoogleDto {
  @IsEmail({}, { message: "Invalid email format!" })
  @IsNotEmpty({ message: "Email is required!" })
  email: string;

  @IsString({ message: "Name must be a string!" })
  @IsNotEmpty({ message: "Name is required!" })
  name: string;
};