import {
  IsInt,
  IsString,
  IsOptional
} from "class-validator";

export class GetAllUsersDto {
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
  province: string = "all";
};