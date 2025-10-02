import { ValidationService } from '../validation.service';

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(() => {
    // Create a mock Prisma service
    const mockPrismaService = {
      prerequisite: {
        findMany: jest.fn(),
      },
      completedCourse: {
        findUnique: jest.fn(),
      },
    };
    
    validationService = new ValidationService(mockPrismaService as any);
  });

  describe('timeConflicts', () => {
    it('should detect time conflicts on the same day', () => {
      const sectionMeetings = [
        { sectionId: 'sec-1', dayOfWeek: 2, startMin: 540, endMin: 660 }, // Tue 9:00-11:00
      ];
      
      const existingMeetings = [
        { sectionId: 'sec-2', dayOfWeek: 2, startMin: 600, endMin: 720 }, // Tue 10:00-12:00
      ];
      
      const conflicts = validationService.timeConflicts(sectionMeetings, existingMeetings);
      
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]).toEqual({
        aSectionId: 'sec-1',
        bSectionId: 'sec-2',
      });
    });

    it('should not detect conflicts on different days', () => {
      const sectionMeetings = [
        { sectionId: 'sec-1', dayOfWeek: 2, startMin: 540, endMin: 660 }, // Tue 9:00-11:00
      ];
      
      const existingMeetings = [
        { sectionId: 'sec-2', dayOfWeek: 3, startMin: 600, endMin: 720 }, // Wed 10:00-12:00
      ];
      
      const conflicts = validationService.timeConflicts(sectionMeetings, existingMeetings);
      
      expect(conflicts).toHaveLength(0);
    });

    it('should not detect conflicts when times do not overlap', () => {
      const sectionMeetings = [
        { sectionId: 'sec-1', dayOfWeek: 2, startMin: 540, endMin: 660 }, // Tue 9:00-11:00
      ];
      
      const existingMeetings = [
        { sectionId: 'sec-2', dayOfWeek: 2, startMin: 660, endMin: 780 }, // Tue 11:00-13:00
      ];
      
      const conflicts = validationService.timeConflicts(sectionMeetings, existingMeetings);
      
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('capacityFull', () => {
    it('should detect sections at capacity', () => {
      const sections = [
        { id: 'sec-1', capacity: 30, enrolled: 30 },
        { id: 'sec-2', capacity: 25, enrolled: 20 },
        { id: 'sec-3', capacity: 10, enrolled: 15 },
      ];
      
      const fullSections = validationService.capacityFull(sections);
      
      expect(fullSections).toEqual(['sec-1', 'sec-3']);
    });

    it('should return empty array when no sections are at capacity', () => {
      const sections = [
        { id: 'sec-1', capacity: 30, enrolled: 25 },
        { id: 'sec-2', capacity: 25, enrolled: 20 },
      ];
      
      const fullSections = validationService.capacityFull(sections);
      
      expect(fullSections).toEqual([]);
    });
  });

  describe('unmetPrereqs', () => {
    it('should detect unmet prerequisites', async () => {
      // Mock prerequisites for a course
      (validationService as any).prisma.prerequisite.findMany.mockResolvedValue([
        {
          requiresId: 'req-1',
          requires: { code: 'CS101' },
        },
        {
          requiresId: 'req-2',
          requires: { code: 'MATH101' },
        },
      ]);
      
      // Mock completed courses (only one prerequisite completed)
      (validationService as any).prisma.completedCourse.findUnique
        .mockResolvedValueOnce({}) // CS101 completed
        .mockResolvedValueOnce(null); // MATH101 not completed
      
      const sectionCourses = [{ id: 'course-1' }];
      const unmetPrereqs = await validationService.unmetPrereqs('student-1', sectionCourses);
      
      expect(unmetPrereqs).toEqual(['MATH101']);
    });

    it('should return empty array when all prerequisites are met', async () => {
      // Mock prerequisites for a course
      (validationService as any).prisma.prerequisite.findMany.mockResolvedValue([
        {
          requiresId: 'req-1',
          requires: { code: 'CS101' },
        },
      ]);
      
      // Mock completed courses (prerequisite completed)
      (validationService as any).prisma.completedCourse.findUnique.mockResolvedValue({});
      
      const sectionCourses = [{ id: 'course-1' }];
      const unmetPrereqs = await validationService.unmetPrereqs('student-1', sectionCourses);
      
      expect(unmetPrereqs).toEqual([]);
    });
  });
});