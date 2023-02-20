import { Module } from '@nestjs/common';
import { CallRecordsService } from './call_records.service';
import { CallRecordsController } from './call_records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from './entities/call_record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallRecord])
  ],
  controllers: [CallRecordsController],
  providers: [CallRecordsService],
  exports: [CallRecordsService],
})
export class CallRecordsModule {}
