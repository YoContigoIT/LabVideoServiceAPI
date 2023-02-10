import { Module } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recording } from './entities/recording.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recording]),
  ],
  controllers: [RecordingsController],
  providers: [RecordingsService],
  exports: [RecordingsService]
})
export class RecordingsModule {}
