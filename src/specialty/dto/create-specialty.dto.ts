import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpecialtyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  normalizedName: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsString()
  imageName: string;

  @IsNotEmpty()
  @IsString()
  image: string;
};