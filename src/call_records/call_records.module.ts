import { Module } from '@nestjs/common';
import { CallRecordsService } from './call_records.service';
import { CallRecordsController } from './call_records.controller';

@Module({
  controllers: [CallRecordsController],
  providers: [CallRecordsService]
})
export class CallRecordsModule {}
