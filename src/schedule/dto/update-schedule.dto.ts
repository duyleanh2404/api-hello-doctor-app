import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateScheduleDto {
  @IsOptional()
  @IsString({ message: "Doctor ID must be a valid string!" })
  doctor_id: string;

  @IsOptional()
  @IsString({ message: "Date must be a valid string!" })
  date: string;

  @IsOptional()
  @IsArray({ message: "Time slots must be a valid array!" })
  timeSlots: TimeSlotDto[];
};

class TimeSlotDto {
  @IsNotEmpty({ message: "Type must not be empty!" })
  @IsString({ message: "Type must be a valid string!" })
  type: string;

  @IsNotEmpty({ message: "Timeline must not be empty!" })
  @IsString({ message: "Timeline must be a valid string!" })
  timeline: string;

  @IsNotEmpty({ message: "isBooked must not be empty!" })
  @IsBoolean({ message: "isBooked must be a valid boolean!" })
  isBooked: boolean;
};