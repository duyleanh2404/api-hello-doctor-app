import { IsOptional, IsString } from "class-validator";

export class EditClinicDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  avatarName: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  bannerName: string;

  @IsOptional()
  @IsString()
  banner: string;
};