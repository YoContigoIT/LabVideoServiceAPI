import { Module } from '@nestjs/common';
import { CallRecordsService } from './call_records.service';
import { CallRecordsController } from './call_records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from './entities/call_record.entity';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CallRecord]), AuthModule],
  controllers: [CallRecordsController],
  providers: [CallRecordsService, RoleGuard, AuthJWTGuard, ApiKeyGuard],
  exports: [CallRecordsService],
})
export class CallRecordsModule {}
