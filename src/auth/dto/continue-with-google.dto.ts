import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class ContinueWithGoogleDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image: string;
};