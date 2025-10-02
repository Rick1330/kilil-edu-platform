import { Module } from '@nestjs/common';
import { EnrollmentModule } from './enrollment.module';
import { HealthController } from './health.controller';

@Module({
  imports: [EnrollmentModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
