import {
  IsInt,
  IsString,
  IsOptional,
  IsPositive
} from "class-validator";

export class GetAllDoctorsDto {
  @IsOptional()
  @IsInt({ message: "Page number must be a positive integer!" })
  @IsPositive({ message: "Page number must be greater than zero!" })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: "Limit must be a positive integer!" })
  @IsPositive({ message: "Limit must be greater than zero!" })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: "Query must be a string!" })
  query?: string;

  @IsOptional()
  @IsString({ message: "Province must be a string!" })
  province?: string;

  @IsOptional()
  @IsString({ message: "Specialty must be a string!" })
  specialty?: string;

  @IsOptional()
  @IsString({ message: "Clinic must be a string!" })
  clinic?: string;
};