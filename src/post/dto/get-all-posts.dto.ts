import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString
} from "class-validator";

export class GetAllPostsDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  specialty_id: string;

  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsBoolean()
  exclude: string;

  @IsOptional()
  @IsDateString()
  releaseDate: string;
};