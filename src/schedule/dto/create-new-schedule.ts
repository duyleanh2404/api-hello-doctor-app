import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsArray()
  timeSlots: Array<{ type: string; timeline: string; isBooked: boolean }>;
};