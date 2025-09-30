import { Query, Resolver } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class Hello {
  @Field()
  message!: string;
}

@Resolver()
export class HelloResolver {
  @Query(() => Hello)
  hello(): Hello {
    return { message: 'Selam Ethiopia' };
  }
}