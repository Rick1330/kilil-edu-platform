import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('courses')
  async searchCourses(@Query('query') query: string) {
    if (!query) {
      return [];
    }
    
    return this.prisma.course.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 20
    });
  }

  @Get('sections')
  async getSections(@Query('termId') termId: string, @Query('courseId') courseId: string) {
    return this.prisma.section.findMany({
      where: {
        termId: termId,
        courseId: courseId
      },
      include: {
        meetings: true,
        course: true
      }
    });
  }
}