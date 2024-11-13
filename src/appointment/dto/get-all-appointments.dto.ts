import {
  IsInt,
  IsDate,
  IsString,
  IsOptional,
  IsPositive
} from "class-validator";

export class GetAllAppointmentsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsDate()
  date: Date;
};