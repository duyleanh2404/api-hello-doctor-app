import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { PaymentService } from "./payment.service";
import { Roles } from "src/auth/passport/roles.decorator";
import { CreatePaymentDto } from "./dto/create-payment.dto";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post("create-payment-url")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("user")
  async createPaymentUrl(@Body() dto: CreatePaymentDto): Promise<{ message: string; paymentUrl: string }> {
    const paymentUrl = this.paymentService.createPaymentUrl(dto);

    return {
      message: "Payment URL created successfully!",
      paymentUrl
    };
  }
};