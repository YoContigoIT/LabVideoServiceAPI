import { Injectable } from '@nestjs/common';
import { CreateRecordingMarkDto } from './dto/create-recording-mark.dto';
import { UpdateRecordingMarkDto } from './dto/update-recording-mark.dto';

@Injectable()
export class RecordingMarkService {
  create(createRecordingMarkDto: CreateRecordingMarkDto) {
    return 'This action adds a new recordingMark';
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
