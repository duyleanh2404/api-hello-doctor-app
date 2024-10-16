import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string!" })
  fullname?: string;

  @IsOptional()
  @IsString({ message: "Image name must be a string!" })
  imageName?: string;

  @IsOptional()
  @IsString({ message: "Image must be a string!" })
  image?: string;

  @IsOptional()
  @IsString({ message: "Gender must be a string!" })
  gender?: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string!" })
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: "Address must be a string!" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Date of birth must be a string!" })
  dateOfBirth?: string;
};