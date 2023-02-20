import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // const request = context.switchToHttp().getRequest();

        // const headerToken = request.rawHeaders[1].split('Bearer ');
        // console.log( {"req": headerToken[1]} );
        
        return super.canActivate(context);
    }
 }
