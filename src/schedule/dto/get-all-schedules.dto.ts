import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class GetAllSchedulesDto {
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
  @IsString({ message: "Date must be a string!" })
  date?: string;
};