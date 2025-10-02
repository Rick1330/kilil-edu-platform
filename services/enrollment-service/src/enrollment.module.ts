import { Module } from '@nestjs/common';
import { PrismaService } from '@kilil/enrollment-service/prisma.service';
import { CatalogController } from '@kilil/enrollment-service/catalog.controller';
import { EnrollmentController } from '@kilil/enrollment-service/enrollment.controller';
import { RegistrationController } from '@kilil/enrollment-service/registration.controller';
import { ValidationService } from '@kilil/enrollment-service/validation.service';

@Module({
  imports: [],
  controllers: [CatalogController, EnrollmentController, RegistrationController],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class EnrollmentModule {}