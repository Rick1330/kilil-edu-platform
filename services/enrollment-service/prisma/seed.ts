// This is a placeholder seed script
// In a real environment, you would uncomment the code below and run `prisma generate` first

/*
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create terms
  const spring2025 = await prisma.term.create({
    data: {
      code: '2025SP',
      name: 'Spring 2025',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  // Create courses
  const cs101 = await prisma.course.create({
    data: {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      credits: 3,
    },
  });

  const math101 = await prisma.course.create({
    data: {
      code: 'MATH101',
      title: 'Calculus I',
      credits: 4,
    },
  });

  const cs201 = await prisma.course.create({
    data: {
      code: 'CS201',
      title: 'Data Structures',
      credits: 3,
    },
  });

  // Create prerequisites
  await prisma.prerequisite.create({
    data: {
      courseId: cs201.id,
      requiresId: cs101.id,
    },
  });

  // Create sections
  const cs101Section1 = await prisma.section.create({
    data: {
      courseId: cs101.id,
      termId: spring2025.id,
      campus: 'Main Campus',
      capacity: 30,
    },
  });

  const cs101Section2 = await prisma.section.create({
    data: {
      courseId: cs101.id,
      termId: spring2025.id,
      campus: 'North Campus',
      capacity: 25,
    },
  });

  const math101Section1 = await prisma.section.create({
    data: {
      courseId: math101.id,
      termId: spring2025.id,
      campus: 'Main Campus',
      capacity: 35,
    },
  });

  const cs201Section1 = await prisma.section.create({
    data: {
      courseId: cs201.id,
      termId: spring2025.id,
      campus: 'Main Campus',
      capacity: 20,
    },
  });

  // Create meeting times
  await prisma.meetingTime.create({
    data: {
      sectionId: cs101Section1.id,
      dayOfWeek: 2, // Tuesday
      startMin: 540, // 9:00 AM
      endMin: 660, // 11:00 AM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: cs101Section1.id,
      dayOfWeek: 4, // Thursday
      startMin: 540, // 9:00 AM
      endMin: 660, // 11:00 AM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: cs101Section2.id,
      dayOfWeek: 3, // Wednesday
      startMin: 600, // 10:00 AM
      endMin: 720, // 12:00 PM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: math101Section1.id,
      dayOfWeek: 2, // Tuesday
      startMin: 660, // 11:00 AM
      endMin: 780, // 1:00 PM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: math101Section1.id,
      dayOfWeek: 4, // Thursday
      startMin: 660, // 11:00 AM
      endMin: 780, // 1:00 PM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: cs201Section1.id,
      dayOfWeek: 2, // Tuesday
      startMin: 780, // 1:00 PM
      endMin: 900, // 3:00 PM
    },
  });

  await prisma.meetingTime.create({
    data: {
      sectionId: cs201Section1.id,
      dayOfWeek: 4, // Thursday
      startMin: 780, // 1:00 PM
      endMin: 900, // 3:00 PM
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/

console.log('Seed script placeholder - uncomment code after generating Prisma client');