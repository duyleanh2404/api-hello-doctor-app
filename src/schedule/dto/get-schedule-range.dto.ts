import {
  IsDate,
  IsString,
  IsNotEmpty
} from "class-validator";

export class GetScheduleRangeDto {
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
};