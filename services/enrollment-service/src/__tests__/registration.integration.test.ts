import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EnrollmentModule } from '../enrollment.module';
import { PrismaService } from '../prisma.service';

describe('RegistrationController (integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [EnrollmentModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /registration/confirm', () => {
    it('should be idempotent with the same clientRef', async () => {
      const clientRef = 'test-client-ref-' + Date.now();
      const requestBody = {
        personId: 'test-student',
        termId: 'test-term',
        sectionIds: ['section-1', 'section-2'],
        clientRef,
      };

      // First request
      const response1 = await request(app.getHttpServer())
        .post('/registration/confirm')
        .send(requestBody)
        .expect(201);

      const registrationId1 = response1.body.registrationId;

      // Second request with the same clientRef
      const response2 = await request(app.getHttpServer())
        .post('/registration/confirm')
        .send(requestBody)
        .expect(201);

      const registrationId2 = response2.body.registrationId;

      // Should return the same registrationId
      expect(registrationId2).toBe(registrationId1);
    });
  });
});