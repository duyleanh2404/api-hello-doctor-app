import { IsNotEmpty, IsString } from "class-validator";

export class CreateClinicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  normalizedName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsString()
  avatarName: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  bannerName: string;

  @IsNotEmpty()
  @IsString()
  banner: string;
};