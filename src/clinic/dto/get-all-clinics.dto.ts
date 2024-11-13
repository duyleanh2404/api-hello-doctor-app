import {
  IsInt,
  IsString,
  IsOptional
} from "class-validator";

export class GetAllClinicsDto {
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
  limit: number = 10;

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