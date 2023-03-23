import { Module } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recording } from './entities/recording.entity';
import { AwsService } from 'src/services/aws/aws.service';
import { AuthModule } from '../auth/auth.module';
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recording]),
    AuthModule
  ],
  controllers: [RecordingsController],
  providers: [RecordingsService, AwsService, RoleGuard, AuthJWTGuard, ApiKeyGuard],
  exports: [RecordingsService]
})
export class RecordingsModule {}
