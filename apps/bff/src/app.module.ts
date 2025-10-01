import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthController } from './health.controller';
import { HelloResolver } from './hello.resolver';
import { MeResolver } from './me.resolver';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'production',
      csrfPrevention: true,
      context: ({ req }: { req: any }) => ({ req })
    }),
  ],
  controllers: [HealthController],
  providers: [HelloResolver, MeResolver],
})
export class AppModule {}