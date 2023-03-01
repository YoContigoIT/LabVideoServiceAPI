import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recording } from '../recordings/entities/recording.entity';
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

  // insertMarkTypeFinishVideoCall(updateRecordingMarkDto: UpdateRecordingMarkDto, duration: number) {
  //   console.log('updateRecordingMarkDto', updateRecordingMarkDto);
    
  //   return this.recordingMarkRepository.save({
  //     // mar
  //     // updateRecordingMarkDto
  //   });
  // }

  seconsToString(duration: number): string {
    var hour = Math.floor(duration / 3600).toString();
    var houraux = (hour < '10') ? '0' + hour : + hour;
    var minute = Math.floor((duration / 60) % 60);
    var minuteaux = (minute < 10) ? '0' + minute : minute;
    var second = duration % 60
    var secondaux = (second < 10) ? '0' + second : second;
    return houraux + ':' + minuteaux + ':' + secondaux;
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
