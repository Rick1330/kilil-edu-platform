import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './auth/gql-auth.guard';
import { RolesGuard } from './auth/roles.guard';

// Map Keycloak access token claims to Principal
function principalFromJwt(jwtPayload: any) {
  const roles = [
    ...(jwtPayload?.realm_access?.roles ?? []),
    ...(jwtPayload?.resource_access?.["web-portal"]?.roles ?? [])
  ];
  return {
    sub: jwtPayload?.sub,
    email: jwtPayload?.email,
    preferredUsername: jwtPayload?.preferred_username,
    roles,
    tenantId: jwtPayload?.tenant_id,   // optional, future use
    campusId: jwtPayload?.campus_id
  };
}

@ObjectType()
class Principal {
  @Field() sub!: string;
  @Field({nullable: true}) email?: string;
  @Field({nullable: true}) preferredUsername?: string;
  @Field(() => [String]) roles!: string[];
}

@Resolver()
export class MeResolver {
  @Query(() => Principal)
  @UseGuards(GqlAuthGuard)
  me(_: any, __: any, ctx: any): Principal {
    const payload = ctx.req.user;
    const p = principalFromJwt(payload);
    return { sub: p.sub, email: p.email, preferredUsername: p.preferredUsername, roles: p.roles };
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  securePing(): string {
    return 'pong';
  }

  @Query(() => String)
  @UseGuards(new RolesGuard(['student']))
  studentOnly(): string {
    return 'student-access';
  }
}