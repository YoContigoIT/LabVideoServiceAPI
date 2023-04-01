import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { LanguagesModule } from '../languages/languages.module';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { AwsService } from 'src/services/aws/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest]),
    LanguagesModule,
    AuthModule,
  ],
  controllers: [GuestsController],
  providers: [GuestsService, RoleGuard, AuthJWTGuard, ApiKeyGuard, AwsService],
  exports: [GuestsService],
})
export class GuestsModule {}
