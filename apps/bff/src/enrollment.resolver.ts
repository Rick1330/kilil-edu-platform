import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ValidationResult, SectionVM } from './enrollment.types';

@Injectable()
@Resolver()
export class EnrollmentResolver {
  constructor(
    private readonly httpService: HttpService,
    @Inject('ENROLLMENT_BASE') private readonly enrollmentBase: string,
    @Inject('BILLING_BASE') private readonly billingBase: string,
  ) {}

  @Query(() => [SectionVM])
  async catalogSearch(
    @Args('query') query: string,
    @Args('termId') termId: string,
  ): Promise<SectionVM[]> {
    // Call enrollment service to get courses
    const coursesResponse = await firstValueFrom(
      this.httpService.get(`${this.enrollmentBase}/api/catalog/courses?query=${query}`),
    );
    
    const courses = coursesResponse.data;
    
    // For each course, get sections
    const sections = [];
    for (const course of courses) {
      const sectionsResponse = await firstValueFrom(
        this.httpService.get(
          `${this.enrollmentBase}/api/sections?termId=${termId}&courseId=${course.id}`,
        ),
      );
      
      for (const section of sectionsResponse.data) {
        sections.push({
          id: section.id,
          courseCode: course.code,
          title: course.title,
          meetings: section.meetings.map((meeting: any) => ({
            dayOfWeek: meeting.dayOfWeek,
            startMin: meeting.startMin,
            endMin: meeting.endMin,
          })),
          seatsOpen: section.capacity - section.enrolled,
        });
      }
    }
    
    return sections;
  }

  @Query(() => [SectionVM])
  async mySchedule(
    @Args('personId') personId: string,
    @Args('termId') termId: string,
  ): Promise<SectionVM[]> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.enrollmentBase}/api/student/${personId}/enrollments?termId=${termId}`,
      ),
    );
    
    return response.data.map((enrollment: any) => ({
      id: enrollment.section.id,
      courseCode: enrollment.section.course.code,
      title: enrollment.section.course.title,
      meetings: enrollment.section.meetings.map((meeting: any) => ({
        dayOfWeek: meeting.dayOfWeek,
        startMin: meeting.startMin,
        endMin: meeting.endMin,
      })),
      seatsOpen: enrollment.section.capacity - enrollment.section.enrolled,
    }));
  }

  @Mutation(() => ValidationResult)
  async validateRegistration(
    @Args('personId') personId: string,
    @Args('termId') termId: string,
    @Args({ name: 'sectionIds', type: () => [String] }) sectionIds: string[],
  ): Promise<ValidationResult> {
    // Call enrollment service to validate
    const validationResponse = await firstValueFrom(
      this.httpService.post(`${this.enrollmentBase}/api/registration/validate`, {
        personId,
        termId,
        sectionIds,
      }),
    );
    
    const validationResult = validationResponse.data;
    
    // Check for financial holds
    try {
      const billingResponse = await firstValueFrom(
        this.httpService.get(`${this.billingBase}/api/billing/summary/${personId}`),
      );
      
      const balanceCents = billingResponse.data.balanceCents || 0;
      // Example threshold - could be configurable
      const threshold = 0; // Any balance triggers hold
      
      if (balanceCents > threshold) {
        validationResult.holds = [...validationResult.holds, 'financial'];
      }
    } catch (error) {
      // If billing service is unavailable, we don't add a hold
      console.error('Failed to check billing status:', error);
    }
    
    return validationResult;
  }

  @Mutation(() => String)
  async confirmRegistration(
    @Args('personId') personId: string,
    @Args('termId') termId: string,
    @Args({ name: 'sectionIds', type: () => [String] }) sectionIds: string[],
    @Args('clientRef') clientRef: string,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(`${this.enrollmentBase}/api/registration/confirm`, {
        personId,
        termId,
        sectionIds,
        clientRef,
      }),
    );
    
    return response.data.registrationId;
  }

  @Mutation(() => Boolean)
  async swapEnrollment(
    @Args('personId') personId: string,
    @Args('termId') termId: string,
    @Args('fromSectionId') fromSectionId: string,
    @Args('toSectionId') toSectionId: string,
  ): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpService.post(`${this.enrollmentBase}/api/enrollments/swap`, {
        personId,
        termId,
        fromSectionId,
        toSectionId,
      }),
    );
    
    return response.data.success;
  }
}