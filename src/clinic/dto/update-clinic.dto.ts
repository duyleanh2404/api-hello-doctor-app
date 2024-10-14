import { IsOptional, IsString } from "class-validator";

export class UpdateClinicDto {
  @IsOptional()
  @IsString({ message: "Name must be a string!" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string!" })
  desc?: string;

  @IsOptional()
  @IsString({ message: "Address must be a string!" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Avatar name must be a string!" })
  avatarName?: string;

  @IsOptional()
  @IsString({ message: "Avatar must be a string!" })
  avatar?: string;

  @IsOptional()
  @IsString({ message: "Banner name must be a string!" })
  bannerName?: string;

  @IsOptional()
  @IsString({ message: "Banner must be a string!" })
  banner?: string;
};