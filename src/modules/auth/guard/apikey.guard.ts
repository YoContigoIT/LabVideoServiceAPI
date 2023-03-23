import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';
import { ApiKey } from 'src/modules/api-key/entities/api-key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private apiKeyService: ApiKeyService,
        private reflector: Reflector,
    ) {}

   async canActivate(context: ExecutionContext) {
        const keyTypes = this.reflector.get<string[]>('keyTypes', context.getHandler());
        
        let key: string;

        if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest();
            key = req.headers['x-api-key'] ?? req.query.api_key;
            if(!key) return false;
        } else if (context.getType() === 'ws') {
            const client = context.switchToWs().getClient();
            key = client.handshake.headers['x-api-key'];
            if(!key) return false;
        }

        let apiKey: ApiKey;
        try {
            apiKey = await this.apiKeyService.isKeyValid(key);
        } catch (err) {
            return false;
        }
        
        if (!apiKey) {
            return false;
        }

        if (!keyTypes?.length || keyTypes.includes(apiKey.type)) {
            return true;
        }

        return false;
    }
}