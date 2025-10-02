import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BillingSummary, Receipt } from './billing.types';
import { randomUUID } from 'crypto';

@Resolver()
export class BillingResolver {
  constructor(private readonly http: HttpService) {}

  @Query(() => BillingSummary)
  async myBilling(@Args('accountId') accountId: string): Promise<BillingSummary> {
    const billingBase = process.env.BILLING_BASE || 'http://localhost:4001';
    const [balRes, recRes] = await Promise.all([
      firstValueFrom(this.http.get(`${billingBase}/billing/${accountId}/balance`)),
      firstValueFrom(this.http.get(`${billingBase}/billing/${accountId}/receipts`))
    ]);
    
    return {
      balanceCents: (balRes as any).data.balanceCents,
      currency: (balRes as any).data.currency,
      receipts: (recRes as any).data as Receipt[]
    };
  }

  @Mutation(() => String)
  async initiatePayment(
    @Args('accountId') accountId: string,
    @Args('amountCents') amountCents: number,
    @Args('channel') channel: string
  ): Promise<string> {
    const paymentsBase = process.env.PAYMENTS_BASE || 'http://localhost:4002';
    const idem = `IDEM-${randomUUID()}`;
    const res = await firstValueFrom(
      this.http.post(
        `${paymentsBase}/payments/initiate`,
        { accountId, amountCents, channel },
        { headers: { 'Idempotency-Key': idem } }
      )
    );
    return (res as any).data.intentRef as string;
  }
}