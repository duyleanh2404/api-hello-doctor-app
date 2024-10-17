import { IsString, IsOptional } from "class-validator";

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: "Specialty ID must be a string!" })
  specialty_id?: string;

  @IsOptional()
  @IsString({ message: "Doctor ID must be a valid MongoDB ID!" })
  doctor_id?: string;

  @IsOptional()
  @IsString({ message: "Title must be a string!" })
  title?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string!" })
  desc?: string;

  @IsOptional()
  @IsString({ message: "Release date must be a string!" })
  release_date?: string;

  @IsOptional()
  @IsString({ message: "Image name must be a string!" })
  imageName?: string;

  @IsOptional()
  @IsString({ message: "Image URL must be a string!" })
  image?: string;
};