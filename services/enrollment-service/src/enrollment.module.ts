import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CatalogController } from './catalog.controller';
import { EnrollmentController } from './enrollment.controller';
import { RegistrationController } from './registration.controller';
import { ValidationService } from './validation.service';

@Module({
  imports: [],
  controllers: [CatalogController, EnrollmentController, RegistrationController],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class EnrollmentModule {}