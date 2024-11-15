import { IsInt, IsDate, IsString, IsOptional } from "class-validator";

export class GetAllAppointmentsDto {
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
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