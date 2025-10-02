import { Injectable, OnModuleInit } from '@nestjs/common';

// Mock Prisma client for development since we can't generate it
export class MockPrismaClient {
  course: any = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: (data: any) => Promise.resolve(data),
  };
  
  section: any = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: (data: any) => Promise.resolve(data),
    update: (data: any) => Promise.resolve(data),
  };
  
  enrollment: any = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: (data: any) => Promise.resolve(data),
    delete: () => Promise.resolve(),
  };
  
  prerequisite: any = {
    findMany: () => Promise.resolve([]),
  };
  
  completedCourse: any = {
    findUnique: () => Promise.resolve(null),
  };
  
  registrationRequest: any = {
    findUnique: () => Promise.resolve(null),
    create: (data: any) => Promise.resolve(data),
  };
  
  term: any = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
  };
  
  meetingTime: any = {
    findMany: () => Promise.resolve([]),
  };
  
  $connect = () => Promise.resolve();
  $disconnect = () => Promise.resolve();
  $transaction = (fn: any) => fn(this);
}

@Injectable()
export class PrismaService extends MockPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}