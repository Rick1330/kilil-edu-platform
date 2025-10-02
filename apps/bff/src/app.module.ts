import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthController } from './health.controller';
import { HelloResolver } from './hello.resolver';
import { MeResolver } from './me.resolver';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { BillingResolver } from './billing.resolver';
import { EnrollmentResolver } from './enrollment.resolver';

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
  providers: [
    HelloResolver, 
    MeResolver, 
    BillingResolver,
    EnrollmentResolver,
    {
      provide: 'ENROLLMENT_BASE',
      useValue: process.env.ENROLLMENT_BASE || 'http://localhost:4003',
    },
    {
      provide: 'BILLING_BASE',
      useValue: process.env.BILLING_BASE || 'http://localhost:4001',
    },
  ],
})
export class AppModule {}