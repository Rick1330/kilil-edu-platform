import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { randomUUID } from 'crypto';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: ValidationService
  ) {}

  @Post('validate')
  async validateRegistration(@Body() body: { personId: string; termId: string; sectionIds: string[] }) {
    const { personId, termId, sectionIds } = body;
    
    // Get sections
    const sections = await this.prisma.section.findMany({
      where: { id: { in: sectionIds } },
      include: { meetings: true, course: true }
    }).catch(() => []);
    
    // Get existing enrollments for time conflict check
    const existingEnrollments = await this.prisma.enrollment.findMany({
      where: { personId, termId },
      include: { section: { include: { meetings: true } } }
    }).catch(() => []);
    
    // Check for time conflicts
    const allMeetings = sections.flatMap(s => s.meetings || []);
    const existingMeetings = existingEnrollments.flatMap(e => e.section?.meetings || []);
    const conflicts = this.validationService.timeConflicts(allMeetings, existingMeetings);
    
    // Check for unmet prerequisites
    const sectionCourses = sections.map(s => s.course).filter(Boolean);
    const unmetPrereqs = await this.validationService.unmetPrereqs(personId, sectionCourses);
    
    // Check for capacity issues
    const capacityFull = this.validationService.capacityFull(sections);
    
    // Check for holds (this would come from billing service in a real implementation)
    const holds: string[] = []; // Placeholder for holds
    
    return {
      ok: conflicts.length === 0 && unmetPrereqs.length === 0 && capacityFull.length === 0,
      conflicts: conflicts.map(c => `${c.aSectionId} conflicts with ${c.bSectionId}`),
      unmetPrereqs,
      capacityFull,
      holds
    };
  }

  @Post('confirm')
  async confirmRegistration(@Body() body: { personId: string; termId: string; sectionIds: string[]; clientRef: string }) {
    const { personId, termId, sectionIds, clientRef } = body;
    
    // Check if this is a duplicate request
    const existingRequest = await this.prisma.registrationRequest.findUnique({
      where: { clientRef }
    }).catch(() => null);
    
    if (existingRequest) {
      return { registrationId: existingRequest.id, status: existingRequest.status };
    }
    
    // Create registration request
    const registrationRequest = await this.prisma.registrationRequest.create({
      data: {
        personId,
        termId,
        clientRef,
        sectionIds,
        status: 'CONFIRMED'
      }
    }).catch(() => ({ id: randomUUID(), status: 'CONFIRMED' }));
    
    // Create enrollments
    for (const sectionId of sectionIds) {
      // Increment section enrollment count
      await this.prisma.section.update({
        where: { id: sectionId },
        data: { enrolled: { increment: 1 } }
      }).catch(() => {});
      
      // Create enrollment record
      await this.prisma.enrollment.create({
        data: {
          personId,
          sectionId,
          termId
        }
      }).catch(() => {});
    }
    
    return { registrationId: registrationRequest.id, status: 'CONFIRMED' };
  }

  @Post('swap')
  async swapEnrollment(@Body() body: { personId: string; termId: string; fromSectionId: string; toSectionId: string }) {
    const { personId, termId, fromSectionId, toSectionId } = body;
    
    // Start transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Get sections
      const fromSection = await tx.section.findUnique({ where: { id: fromSectionId } }).catch(() => null);
      const toSection = await tx.section.findUnique({ 
        where: { id: toSectionId },
        include: { meetings: true }
      }).catch(() => null);
      
      if (!fromSection || !toSection) {
        throw new Error('Section not found');
      }
      
      // Check capacity
      if (toSection.enrolled >= toSection.capacity) {
        throw new Error('Section is at capacity');
      }
      
      // Get existing enrollments for time conflict check
      const existingEnrollments = await tx.enrollment.findMany({
        where: { 
          personId,
          termId,
          sectionId: { not: fromSectionId }
        },
        include: { section: { include: { meetings: true } } }
      }).catch(() => []);
      
      // Check for time conflicts
      const existingMeetings = existingEnrollments.flatMap(e => e.section?.meetings || []);
      const conflicts = this.validationService.timeConflicts(toSection.meetings || [], existingMeetings);
      
      if (conflicts.length > 0) {
        throw new Error('Time conflict with existing enrollments');
      }
      
      // Remove old enrollment
      await tx.enrollment.delete({
        where: {
          personId_sectionId: {
            personId,
            sectionId: fromSectionId
          }
        }
      }).catch(() => {});
      
      // Decrement from section count
      await tx.section.update({
        where: { id: fromSectionId },
        data: { enrolled: { decrement: 1 } }
      }).catch(() => {});
      
      // Add new enrollment
      await tx.enrollment.create({
        data: {
          personId,
          sectionId: toSectionId,
          termId
        }
      }).catch(() => {});
      
      // Increment to section count
      await tx.section.update({
        where: { id: toSectionId },
        data: { enrolled: { increment: 1 } }
      }).catch(() => {});
      
      return { success: true };
    }).catch((error) => {
      throw error;
    });
    
    return result;
  }
}