import { Injectable } from '@nestjs/common';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { UpdateCallRecordDto } from './dto/update-call_record.dto';

@Injectable()
export class CallRecordsService {
  create(createCallRecordDto: CreateCallRecordDto) {
    return 'This action adds a new callRecord';
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
