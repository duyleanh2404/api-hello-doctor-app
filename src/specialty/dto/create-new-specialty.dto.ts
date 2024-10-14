import { IsNotEmpty, IsString } from "class-validator";

export class CreateNewSpecialtyDto {
  @IsNotEmpty({ message: "Specialty name must not be empty!" })
  @IsString({ message: "Specialty name must be a string!" })
  name: string;

  @IsNotEmpty({ message: "Normalized name must not be empty!" })
  @IsString({ message: "Normalized name must be a string!" })
  normalizedName: string;

  @IsNotEmpty({ message: "Description must not be empty!" })
  @IsString({ message: "Description must be a string!" })
  desc: string;

  @IsNotEmpty({ message: "Image name must not be empty!" })
  @IsString({ message: "Image name must be a string!" })
  imageName: string;

  @IsNotEmpty({ message: "Image must not be empty!" })
  @IsString({ message: "Image must be a string (base64)!" })
  image: string;
};