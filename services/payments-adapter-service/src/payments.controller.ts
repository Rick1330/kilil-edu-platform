import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

const idempotencyStore = new Map<string, string>(); // Idempotency-Key -> intentRef (Phase 2: in-memory ok)

@Controller('payments')
export class PaymentsController {
  constructor(private readonly http: HttpService) {}

  @Post('initiate')
  async initiate(
    @Body() body: { accountId: string; amountCents: number; channel: string },
    @Headers('Idempotency-Key') idem?: string
  ) {
    if (!idem) throw new Error('Idempotency-Key header required');
    if (idempotencyStore.has(idem)) {
      const intentRef = idempotencyStore.get(idem)!;
      return { intentRef, status: 'PENDING' };
    }
    const intentRef = `INT-${randomUUID()}`;
    idempotencyStore.set(idem, intentRef);
    // no downstream side-effects on initiate (only at webhook)
    return { intentRef, status: 'PENDING' };
  }

  @Post('webhooks/:provider')
  async webhook(
    @Param('provider') provider: string,
    @Body() body: { accountId: string; amountCents: number; txnRef: string; channel?: string }
  ) {
    // Simulate PSP callback and forward to Billing
    const billingUrl = process.env.BILLING_INTERNAL_URL || 'http://localhost:4001'; // adjust port
    const payload = {
      accountId: body.accountId,
      amountCents: body.amountCents,
      channel: body.channel ?? provider,
      txnRef: body.txnRef
    };
    await firstValueFrom(this.http.post(`${billingUrl}/internal/payment-received`, payload));
    return { ok: true };
  }
}