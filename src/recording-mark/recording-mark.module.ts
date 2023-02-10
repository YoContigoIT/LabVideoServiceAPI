import { Module } from '@nestjs/common';
import { RecordingMarkService } from './recording-mark.service';
import { RecordingMarkController } from './recording-mark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingMark } from './entities/recording-mark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordingMark]),
  ],
  controllers: [RecordingMarkController],
  providers: [RecordingMarkService]
})
export class RecordingMarkModule {}
