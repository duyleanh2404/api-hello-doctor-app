import {
  IsInt,
  IsDate,
  IsString,
  IsOptional
} from "class-validator";

export class GetAllSchedulesDto {
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
  @IsDate()
  date: Date;
};