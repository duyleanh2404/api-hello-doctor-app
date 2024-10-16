import {
  Min,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMongoId
} from "class-validator";

export class CreateNewDoctorDto {
  @IsNotEmpty({ message: "Specialty ID is required!" })
  @IsMongoId({ message: "Specialty ID must be a valid MongoDB ObjectId!" })
  specialty_id: string;

  @IsNotEmpty({ message: "Clinic ID is required!" })
  @IsMongoId({ message: "Clinic ID must be a valid MongoDB ObjectId!" })
  clinic_id: string;

  @IsNotEmpty({ message: "Full name is required!" })
  @IsString({ message: "Full name must be a string!" })
  fullname: string;

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
  @IsString({ message: "Image must be a string!" })
  image?: string;
};