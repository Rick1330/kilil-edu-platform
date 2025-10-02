import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValidationResult {
  @Field()
  ok!: boolean;

  @Field(() => [String])
  conflicts!: string[];

  @Field(() => [String])
  unmetPrereqs!: string[];

  @Field(() => [String])
  capacityFull!: string[];

  @Field(() => [String])
  holds!: string[];
}

@ObjectType()
export class Meeting {
  @Field()
  dayOfWeek!: number;

  @Field()
  startMin!: number;

  @Field()
  endMin!: number;
}

@ObjectType()
export class SectionVM {
  @Field()
  id!: string;

  @Field()
  courseCode!: string;

  @Field()
  title!: string;

  @Field(() => [Meeting])
  meetings!: Meeting[];

  @Field()
  seatsOpen!: number;
}