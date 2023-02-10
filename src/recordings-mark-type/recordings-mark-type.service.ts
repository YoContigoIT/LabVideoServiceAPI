import { Injectable } from '@nestjs/common';
import { CreateRecordingsMarkTypeDto } from './dto/create-recordings-mark-type.dto';
import { UpdateRecordingsMarkTypeDto } from './dto/update-recordings-mark-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingsMarkType } from './entities/recordings-mark-type.entity';

@Injectable()
export class RecordingsMarkTypeService {
  constructor(
    @InjectRepository(RecordingsMarkType) private recordingsMarkTypeRepository: Repository<RecordingsMarkType>,
  ) {}
  create(createRecordingsMarkTypeDto: CreateRecordingsMarkTypeDto) {
    return 'This action adds a new recordingsMarkType';
  }

  findAll() {
    return `This action returns all recordingsMarkType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordingsMarkType`;
  }

  update(id: number, updateRecordingsMarkTypeDto: UpdateRecordingsMarkTypeDto) {
    return `This action updates a #${id} recordingsMarkType`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordingsMarkType`;
  }
}
