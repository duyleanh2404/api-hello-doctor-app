import { IsOptional, IsString, IsNumber, IsDateString } from "class-validator";

export class GetAllPostsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  doctor?: string;

  @IsOptional()
  @IsDateString()
  release_date?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
};