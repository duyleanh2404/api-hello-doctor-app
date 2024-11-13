import { IsString, IsOptional } from "class-validator";

export class EditPostDto {
  @IsOptional()
  @IsString()
  specialty_id: string;

  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  releaseDate: string;

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