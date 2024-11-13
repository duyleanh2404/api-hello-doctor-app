import {
  IsDate,
  IsString,
  IsBoolean,
  IsNotEmpty
} from "class-validator";

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsBoolean()
  newPatients: boolean;

  @IsNotEmpty()
  @IsString()
  zaloPhone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  reasons: string;

  @IsNotEmpty()
  @IsString()
  payment: string;
};