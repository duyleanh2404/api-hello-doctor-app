import { IsOptional, IsString } from "class-validator";

export class EditSpecialtyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  imageName: string;

  @IsOptional()
  @IsString()
  image: string;
};