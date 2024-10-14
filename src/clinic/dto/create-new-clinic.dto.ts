import { IsNotEmpty, IsString } from "class-validator";

export class CreateNewClinicDto {
  @IsNotEmpty({ message: "Clinic name must not be empty!" })
  @IsString({ message: "Clinic name must be a string!" })
  name: string;

  @IsNotEmpty({ message: "Normalized name must not be empty!" })
  @IsString({ message: "Normalized name must be a string!" })
  normalizedName: string;

  @IsNotEmpty({ message: "Clinic address must not be empty!" })
  @IsString({ message: "Clinic address must be a string!" })
  address: string;

  @IsNotEmpty({ message: "Province must not be empty!" })
  @IsString({ message: "Province must be a string!" })
  province: string;

  @IsNotEmpty({ message: "Description must not be empty!" })
  @IsString({ message: "Description must be a string!" })
  desc: string;

  @IsNotEmpty({ message: "Avatar name must not be empty!" })
  @IsString({ message: "Avatar name must be a string!" })
  avatarName: string;

  @IsNotEmpty({ message: "Avatar must not be empty!" })
  @IsString({ message: "Avatar must be a string (base64)!" })
  avatar: string;

  @IsNotEmpty({ message: "Banner name must not be empty!" })
  @IsString({ message: "Banner name must be a string!" })
  bannerName: string;

  @IsNotEmpty({ message: "Banner must not be empty!" })
  @IsString({ message: "Banner must be a string (base64)!" })
  banner: string;
};