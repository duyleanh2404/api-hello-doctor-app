import {
  Min,
  IsNumber,
  IsString,
  IsMongoId,
  IsOptional,
  IsNotEmpty
} from "class-validator";

export class UpdateDoctorDto {
  @IsOptional()
  @IsNotEmpty({ message: "Specialty ID cannot be empty if provided!" })
  @IsMongoId({ message: "Specialty ID must be a valid MongoDB ObjectId!" })
  specialty_id?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Clinic ID cannot be empty if provided!" })
  @IsMongoId({ message: "Clinic ID must be a valid MongoDB ObjectId!" })
  clinic_id?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Full name cannot be empty if provided!" })
  @IsString({ message: "Full name must be a string!" })
  fullname?: string;

  @IsOptional()
  @IsString({ message: "Province must be a string!" })
  province?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string!" })
  desc?: string;

  @IsOptional()
  @IsNumber({}, { message: "Medical fee must be a number!" })
  @Min(0, { message: "Medical fee must be a positive number!" })
  medical_fee?: number;

  @IsOptional()
  @IsString({ message: "Image name must be a string!" })
  imageName?: string;

  @IsOptional()
  @IsString({ message: "Image must be a string!" })
  image?: string;
};