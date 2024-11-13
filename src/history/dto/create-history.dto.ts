import { IsNotEmpty, IsString } from "class-validator";

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  appointment_id: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  doctorComment: string;

  @IsNotEmpty()
  @IsString()
  healthStatus: string;

  @IsNotEmpty()
  @IsString()
  prescriptionImage: string;
};