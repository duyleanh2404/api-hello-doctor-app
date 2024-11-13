import {
  Min,
  Max,
  IsNumber,
  IsString,
  IsOptional
} from "class-validator";

export class EditDoctorDto {
  @IsOptional()
  @IsString()
  specialty_id: string;

  @IsOptional()
  @IsString()
  clinic_id: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsNumber()
  @Min(100000)
  @Max(1000000)
  medicalFee: number;

  @IsOptional()
  @IsString()
  imageName: string;

  @IsOptional()
  @IsString()
  image: string;
};