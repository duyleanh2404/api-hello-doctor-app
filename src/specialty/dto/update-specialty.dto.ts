import { IsOptional, IsString } from "class-validator";

export class UpdateSpecialtyDto {
  @IsOptional()
  @IsString({ message: "Name must be a string!" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string!" })
  desc?: string;

  @IsOptional()
  @IsString({ message: "Image name must be a string!" })
  imageName?: string;

  @IsOptional()
  @IsString({ message: "Image must be a string!" })
  image?: string;
};