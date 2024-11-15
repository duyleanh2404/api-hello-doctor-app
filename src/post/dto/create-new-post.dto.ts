import { IsString, IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsString()
  specialty_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  releaseDate: string;

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