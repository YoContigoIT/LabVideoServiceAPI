import { Injectable } from '@nestjs/common';
import { CreateRecordingsMarkTypeDto } from './dto/create-recordings-mark-type.dto';
import { UpdateRecordingsMarkTypeDto } from './dto/update-recordings-mark-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingsMarkType } from './entities/recordings-mark-type.entity';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';

@Injectable()
export class RecordingsMarkTypeService {
  constructor(
    @InjectRepository(RecordingsMarkType)
    private recordingsMarkTypeRepository: Repository<RecordingsMarkType>,
  ) {}

  create(createRecordingsMarkTypeDto: CreateRecordingsMarkTypeDto) {
    return this.recordingsMarkTypeRepository.save(createRecordingsMarkTypeDto);
  }

  async findAll() {
    const data = await this.recordingsMarkTypeRepository.find();
    return data.filter((i) => !i.type);
  }

  findOne(id: string) {
    return this.recordingsMarkTypeRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateRecordingsMarkTypeDto: UpdateRecordingsMarkTypeDto,
  ) {
    const response = await this.recordingsMarkTypeRepository
      .createQueryBuilder()
      .update(RecordingsMarkType)
      .set(updateRecordingsMarkTypeDto)
      .where('id = :id', { id })
      .execute();

    return parseAffeceRowToHttpResponse(response.affected);
  }

  async remove(id: string) {
    const response = await this.recordingsMarkTypeRepository.softDelete(id);

    return parseAffeceRowToHttpResponse(response.affected);
  }
}
