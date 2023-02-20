import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordingMarkDto } from './dto/create-recording-mark.dto';
import { UpdateRecordingMarkDto } from './dto/update-recording-mark.dto';
import { RecordingMark } from './entities/recording-mark.entity';

@Injectable()
export class RecordingMarkService {
  constructor (
    @InjectRepository(RecordingMark) private recordingMarkRepository: Repository<RecordingMark>,
  ) {}
  
  create(createRecordingMarkDto: CreateRecordingMarkDto) {    
    return this.recordingMarkRepository.save(createRecordingMarkDto);
  }

  findAll() {
    return `This action returns all recordingMark`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordingMark`;
  }

  update(id: number, updateRecordingMarkDto: UpdateRecordingMarkDto) {
    return `This action updates a #${id} recordingMark`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordingMark`;
  }
}
