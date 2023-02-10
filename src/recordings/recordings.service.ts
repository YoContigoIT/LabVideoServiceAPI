import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { UpdateRecordingDto } from './dto/update-recording.dto';
import { Recording } from './entities/recording.entity';

@Injectable()
export class RecordingsService {
  constructor(
    @InjectRepository(Recording) private recordingRepository: Repository<Recording>
  ) {}
  async create(createRecordingDto: CreateRecordingDto) {
    const recordingInfo = await this.recordingRepository.save(createRecordingDto);
    return recordingInfo;
  }

  findAll() {
    return `This action returns all recordings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recording`;
  }

  update(id: number, updateRecordingDto: UpdateRecordingDto) {
    return `This action updates a #${id} recording`;
  }

  remove(id: number) {
    return `This action removes a #${id} recording`;
  }
}
