import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('payments-adapter-service', () => {
  let paymentsController: PaymentsController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PaymentsController],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should have a placeholder test', () => {
    expect(true).toBe(true);
  });

  describe('initiate', () => {
    it('should throw error when Idempotency-Key header is missing', async () => {
      await expect(
        paymentsController.initiate({ accountId: 'acc-123', amountCents: 10000, channel: 'telebirr' })
      ).rejects.toThrow('Idempotency-Key header required');
    });

    it('should return existing intentRef for duplicate idempotency key', async () => {
      // First call
      const result1 = await paymentsController.initiate(
        { accountId: 'acc-123', amountCents: 10000, channel: 'telebirr' },
        'idem-key-1'
      );
      
      // Second call with same idempotency key
      const result2 = await paymentsController.initiate(
        { accountId: 'acc-123', amountCents: 10000, channel: 'telebirr' },
        'idem-key-1'
      );
      
      expect(result1.intentRef).toBe(result2.intentRef);
      expect(result1.status).toBe('PENDING');
    });

    it('should generate new intentRef for different idempotency keys', async () => {
      const result1 = await paymentsController.initiate(
        { accountId: 'acc-123', amountCents: 10000, channel: 'telebirr' },
        'idem-key-1'
      );
      
      const result2 = await paymentsController.initiate(
        { accountId: 'acc-123', amountCents: 10000, channel: 'telebirr' },
        'idem-key-2'
      );
      
      expect(result1.intentRef).not.toBe(result2.intentRef);
      expect(result1.intentRef).toMatch(/^INT-/);
      expect(result2.intentRef).toMatch(/^INT-/);
    });
  });

  describe('webhook', () => {
    it('should forward webhook payload to billing service', async () => {
      const mockResponse = {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse as any));

      await paymentsController.webhook('telebirr', {
        accountId: 'acc-123',
        amountCents: 10000,
        txnRef: 'txn-123',
        channel: 'telebirr'
      });

      expect(postSpy).toHaveBeenCalledWith(
        'http://localhost:4001/internal/payment-received',
        {
          accountId: 'acc-123',
          amountCents: 10000,
          channel: 'telebirr',
          txnRef: 'txn-123'
        }
      );
    });

    it('should use provider as channel when channel is not provided', async () => {
      const mockResponse = {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse as any));

      await paymentsController.webhook('mpesa', {
        accountId: 'acc-123',
        amountCents: 10000,
        txnRef: 'txn-123'
      });

      expect(postSpy).toHaveBeenCalledWith(
        'http://localhost:4001/internal/payment-received',
        {
          accountId: 'acc-123',
          amountCents: 10000,
          channel: 'mpesa',
          txnRef: 'txn-123'
        }
      );
    });
  });
});