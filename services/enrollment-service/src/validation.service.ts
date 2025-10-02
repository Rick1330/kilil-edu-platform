import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  // Check for time conflicts between sections
  timeConflicts(sectionMeetings: any[], existingMeetings: any[]): any[] {
    const conflicts = [];
    
    for (const sectionMeeting of sectionMeetings) {
      for (const existingMeeting of existingMeetings) {
        // Same day
        if (sectionMeeting.dayOfWeek === existingMeeting.dayOfWeek) {
          // Check if time ranges overlap
          if (
            (sectionMeeting.startMin < existingMeeting.endMin) &&
            (sectionMeeting.endMin > existingMeeting.startMin)
          ) {
            conflicts.push({
              aSectionId: sectionMeeting.sectionId,
              bSectionId: existingMeeting.sectionId
            });
          }
        }
      }
    }
    
    return conflicts;
  }

  // Check for unmet prerequisites
  async unmetPrereqs(personId: string, sectionCourses: any[]): Promise<string[]> {
    const unmetPrereqs = [];
    
    for (const course of sectionCourses) {
      const prereqs = await this.prisma.prerequisite.findMany({
        where: { courseId: course.id },
        include: { requires: true }
      });
      
      for (const prereq of prereqs) {
        const completed = await this.prisma.completedCourse.findUnique({
          where: {
            personId_courseId: {
              personId: personId,
              courseId: prereq.requiresId
            }
          }
        });
        
        if (!completed) {
          unmetPrereqs.push(prereq.requires.code);
        }
      }
    }
    
    return unmetPrereqs;
  }

  // Check for capacity issues
  capacityFull(sections: any[]): string[] {
    const fullSections = [];
    
    for (const section of sections) {
      if (section.enrolled >= section.capacity) {
        fullSections.push(section.id);
      }
    }
    
    return fullSections;
  }
}