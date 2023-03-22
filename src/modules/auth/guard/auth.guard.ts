import { ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') {}
