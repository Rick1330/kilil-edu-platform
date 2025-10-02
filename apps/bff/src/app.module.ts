import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthController } from './health.controller';
import { HelloResolver } from './hello.resolver';
import { MeResolver } from './me.resolver';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { BillingResolver } from './billing.resolver';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'production',
      csrfPrevention: true,
      context: ({ req }: { req: any }) => ({ req })
    }),
  ],
  controllers: [HealthController],
  providers: [HelloResolver, MeResolver, BillingResolver],
})
export class AppModule {}