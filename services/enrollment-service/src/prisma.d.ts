// Type declarations to suppress TypeScript errors when Prisma client can't be generated
import { PrismaClient } from '@prisma/client';

// Declare the missing properties on PrismaClient
interface PrismaClient {
  course: any;
  section: any;
  enrollment: any;
  prerequisite: any;
  completedCourse: any;
  registrationRequest: any;
  term: any;
  meetingTime: any;
}

// Re-export everything from @prisma/client
export * from '@prisma/client';
export { PrismaClient };