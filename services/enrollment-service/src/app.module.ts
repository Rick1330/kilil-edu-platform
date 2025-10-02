import { Module } from '@nestjs/common';
import { EnrollmentModule } from '@kilil/enrollment-service/enrollment.module';
import { HealthController } from '@kilil/enrollment-service/health.controller';

@Module({
  imports: [EnrollmentModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}