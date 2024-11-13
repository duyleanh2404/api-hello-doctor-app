import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  txnRef: string;

  @IsString()
  @IsNotEmpty()
  orderInfo: string;

  @IsString()
  @IsNotEmpty()
  returnUrl: string;
};