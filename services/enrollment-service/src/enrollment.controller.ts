import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('student')
export class EnrollmentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':personId/enrollments')
  async getStudentEnrollments(
    @Param('personId') personId: string,
    @Query('termId') termId: string
  ) {
    return this.prisma.enrollment.findMany({
      where: {
        personId: personId,
        termId: termId
      },
      include: {
        section: {
          include: {
            course: true,
            meetings: true
          }
        }
      }
    });
  }
}