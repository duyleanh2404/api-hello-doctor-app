import {
  IsDate,
  IsString,
  IsOptional
} from "class-validator";

export class GetScheduleDto {
  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsOptional()
  @IsString()
  schedule_id: string;

  @IsOptional()
  @IsDate()
  date: Date;
};