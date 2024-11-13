import {
  IsInt,
  IsString,
  IsOptional
} from "class-validator";

export class GetAllDoctorsDto {
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
  limit: number = 10;

  @IsOptional()
  @IsString()
  specialty_id: string;

  @IsOptional()
  @IsString()
  clinic_id: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  exclude: string;

  @IsOptional()
  @IsString()
  province: string = "all";
};