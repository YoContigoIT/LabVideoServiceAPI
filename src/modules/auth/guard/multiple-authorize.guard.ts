import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiKeyGuard } from './apikey.guard';
import { AuthJWTGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

@Injectable()
export class MultipleAuthorizeGuard implements CanActivate {
  constructor(
    private roleGuard: RoleGuard,
    private authJWTGuard: AuthJWTGuard,
    private apiKeyGuard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    return (
      (await this.apiKeyGuard.canActivate(context)) ||
      ((await this.authJWTGuard.canActivate(context)) &&
        this.roleGuard.canActivate(context))
    );
  }
}
