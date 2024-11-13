import { Injectable } from "@nestjs/common";

import { VnpayService } from "nestjs-vnpay";
import { ProductCode, VnpLocale } from "vnpay";

import { CreatePaymentDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentService {
  constructor(private readonly vnpayService: VnpayService) { }

  createPaymentUrl({ amount, txnRef, orderInfo, returnUrl }: CreatePaymentDto) {
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: "192.168.11.122",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: VnpLocale.VN
    });

    return paymentUrl;
  }
};