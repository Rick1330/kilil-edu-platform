import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('billing/:accountId/balance')
  getBalance(@Param('accountId') accountId: string) {
    return this.billingService.getBalance(accountId);
  }

  @Get('billing/:accountId/receipts')
  getReceipts(@Param('accountId') accountId: string) {
    return this.billingService.getReceipts(accountId);
  }

  @Post('billing/charges')
  createCharge(@Body() chargeData: { accountId: string; amountCents: number; type: string }) {
    return this.billingService.createCharge(chargeData);
  }

  @Post('internal/payment-received')
  processPayment(@Body() paymentData: { accountId: string; amountCents: number; channel: string; txnRef: string }) {
    return this.billingService.processPayment(paymentData);
  }
}