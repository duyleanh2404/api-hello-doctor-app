import {
  IsDate,
  IsArray,
  IsString,
  IsOptional
} from "class-validator";

export class EditScheduleDto {
  @IsOptional()
  @IsString()
  doctor_id: string;

  @IsOptional()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsArray()
  timeSlots: Array<{ timeline: string; isBooked: boolean }>;
};