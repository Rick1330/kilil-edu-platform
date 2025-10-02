import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Receipt {
  @Field(() => ID) id!: string;
  @Field() amountCents!: number;
  @Field() channel!: string;
  @Field() settledAt!: string;
}

@ObjectType()
export class BillingSummary {
  @Field() balanceCents!: number;
  @Field() currency!: string;
  @Field(() => [Receipt]) receipts!: Receipt[];
}