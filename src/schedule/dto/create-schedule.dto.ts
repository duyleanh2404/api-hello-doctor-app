import {
  IsDate,
  IsArray,
  IsString,
  IsNotEmpty
} from "class-validator";

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  timeSlots: Array<{ timeline: string; isBooked: boolean }>;
};