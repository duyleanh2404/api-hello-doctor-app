import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ignoreLogger } from "vnpay";
import { VnpayModule } from "nestjs-vnpay";

import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";

@Module({
  imports: [
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        tmnCode: configService.getOrThrow<string>("VNPAY_TMN_CODE"),
        secureSecret: configService.getOrThrow<string>("VNPAY_SECURE_SECRET"),
        loggerFn: ignoreLogger
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { };