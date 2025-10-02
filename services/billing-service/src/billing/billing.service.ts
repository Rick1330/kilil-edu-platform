import { Injectable } from '@nestjs/common';
import { PrismaClient, PaymentStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getBalance(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { balanceCents: true, currency: true },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      balanceCents: account.balanceCents,
      currency: account.currency,
    };
  }

  async getReceipts(accountId: string) {
    const receipts = await this.prisma.receipt.findMany({
      where: { accountId },
      select: {
        id: true,
        amountCents: true,
        channel: true,
        settledAt: true,
      },
    });

    return receipts;
  }

  async createCharge(chargeData: { accountId: string; amountCents: number; type: string }) {
    // Update account balance
    await this.prisma.account.update({
      where: { id: chargeData.accountId },
      data: {
        balanceCents: {
          increment: chargeData.amountCents,
        },
      },
    });

    // Create charge record
    const charge = await this.prisma.charge.create({
      data: {
        accountId: chargeData.accountId,
        amountCents: chargeData.amountCents,
        type: chargeData.type,
      },
    });

    return charge;
  }

  async processPayment(paymentData: { accountId: string; amountCents: number; channel: string; txnRef: string }) {
    // Check if payment already exists with this txnRef
    const existingPayment = await this.prisma.payment.findUnique({
      where: { txnRef: paymentData.txnRef },
    });

    if (existingPayment && existingPayment.status === 'SETTLED') {
      // Idempotent: return success if already settled
      return existingPayment;
    }

    // Create or update payment
    const payment = await this.prisma.payment.upsert({
      where: { txnRef: paymentData.txnRef },
      update: { status: PaymentStatus.SETTLED },
      create: {
        accountId: paymentData.accountId,
        amountCents: paymentData.amountCents,
        channel: paymentData.channel,
        txnRef: paymentData.txnRef,
        status: PaymentStatus.SETTLED,
      },
    });

    // Create receipt
    await this.prisma.receipt.create({
      data: {
        paymentId: payment.id,
        accountId: paymentData.accountId,
        amountCents: paymentData.amountCents,
        channel: paymentData.channel,
      },
    });

    // Update account balance
    await this.prisma.account.update({
      where: { id: paymentData.accountId },
      data: {
        balanceCents: {
          decrement: paymentData.amountCents,
        },
      },
    });

    return payment;
  }
}