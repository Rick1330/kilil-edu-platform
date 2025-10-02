import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController, HealthController]
})
export class AppModule {}