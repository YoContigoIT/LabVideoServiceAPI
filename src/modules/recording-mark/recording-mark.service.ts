import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordingMarkDto } from './dto/create-recording-mark.dto';
import { RecordingMark } from './entities/recording-mark.entity';

@Injectable()
export class RecordingMarkService {
  constructor(
    @InjectRepository(RecordingMark)
    private recordingMarkRepository: Repository<RecordingMark>,
  ) {}

  create(createRecordingMarkDto: CreateRecordingMarkDto) {
    return this.recordingMarkRepository.save(createRecordingMarkDto);
  }

  seconsToString(duration: number): string {
    const hour = Math.floor(duration / 3600).toString();
    const houraux = hour < '10' ? '0' + hour : +hour;
    const minute = Math.floor((duration / 60) % 60);
    const minuteaux = minute < 10 ? '0' + minute : minute;
    const second = duration % 60;
    const secondaux = second < 10 ? '0' + second : second;
    return houraux + ':' + minuteaux + ':' + secondaux;
  }
}
