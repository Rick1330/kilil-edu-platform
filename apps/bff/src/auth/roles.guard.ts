import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly required: string[]) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user || {};
    const roles: string[] = [
      ...(user?.realm_access?.roles ?? []),
      ...(user?.resource_access?.['web-portal']?.roles ?? [])
    ];
    return this.required.some(r => roles.includes(r));
  }
}