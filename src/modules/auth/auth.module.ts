import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtStrategy } from 'src/utilities/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeyModule } from '../api-key/api-key.module';
import { AuthJWTGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
import { ApiKeyGuard } from './guard/apikey.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret_key'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiration_time'),
        },
      }),
      inject: [ConfigService],
    }),
    ApiKeyModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    AuthJWTGuard,
    RoleGuard,
    ApiKeyGuard,
  ],
  exports: [JwtModule, ApiKeyModule],
})
export class AuthModule {}
