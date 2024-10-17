import { IsNotEmpty, IsString, IsOptional, IsMongoId } from "class-validator";

export class CreatePostDto {
  @IsMongoId({ message: "Specialty ID must be a string!" })
  specialty_id: string;

  @IsMongoId({ message: "Doctor ID must be a string!" })
  doctor_id: string;

  @IsNotEmpty({ message: "Title is required!" })
  @IsString({ message: "Title must be a string!" })
  title: string;

  @IsNotEmpty({ message: "Description is required!" })
  @IsString({ message: "Description must be a string!" })
  desc: string;

  @IsOptional()
  @IsString({ message: "Release date must be a string!" })
  release_date?: string;

  @IsOptional()
  @IsString({ message: "Image URL must be a string!" })
  imageName?: string;

  @IsOptional()
  @IsString({ message: "Image URL must be a string!" })
  image?: string;
};