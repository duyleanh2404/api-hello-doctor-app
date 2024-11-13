import { IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  imageName: string;

  @IsOptional()
  @IsString()
  image: string;
};