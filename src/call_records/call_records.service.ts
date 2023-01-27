import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { UpdateCallRecordDto } from './dto/update-call_record.dto';
import { CallRecord } from './entities/call_record.entity';

@Injectable()
export class CallRecordsService {
  constructor(
    @InjectRepository(CallRecord) private callRecordRepository: Repository<CallRecord>
  ) {}
  create(createCallRecordDto: CreateCallRecordDto) {
    return this.callRecordRepository.save(createCallRecordDto);
  }

  findAll() {
    return `This action returns all callRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} callRecord`;
  }

  update(id: number, updateCallRecordDto: UpdateCallRecordDto) {
    return `This action updates a #${id} callRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} callRecord`;
  }
}
