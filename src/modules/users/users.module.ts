import { Injectable, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/utilities/jwt.strategy';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    ApiKeyModule
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})
export class UsersModule {}
