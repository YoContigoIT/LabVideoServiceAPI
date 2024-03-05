import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private authService: AuthService) {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apikey: string, done: any) => {
        const checkKey = await authService.validateApiKey(apikey);
        if (!checkKey) return done(false);

        return done(true);
      },
    );
  }
}
