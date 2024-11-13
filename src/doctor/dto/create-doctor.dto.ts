import {
  Min,
  Max,
  IsNumber,
  IsString,
  IsNotEmpty
} from "class-validator";

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  specialty_id: string;

  @IsNotEmpty()
  @IsString()
  clinic_id: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(200000)
  @Max(1000000)
  medicalFee: number;

  @IsNotEmpty()
  @IsString()
  image: string;
};