import { Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingsMarkType } from '../modules/recordings-mark-type/entities/recordings-mark-type.entity';

@Injectable()
export class RecordingsMarkTypeSeeder implements Seeder {
    constructor(
        @InjectRepository(RecordingsMarkType) private recordingsMarkTypeRepository: Repository<RecordingsMarkType>
    ) {}

  async seed(): Promise<any> {
    const recordingMarkTypes: RecordingsMarkType[] = [
        { type: "INIT_VIDEO_CALL", typeTitle: "call init", },
        { type: "FINISH_VIDEO_CALL", typeTitle: "call finished", },
        { type: "START_RECORDING", typeTitle: "start recording video call", },
        { type: "STOP_RECORDING", typeTitle: "stop recording video call", }
    ]

    // Insert into the database.
    const marksTypes = this.recordingsMarkTypeRepository.create(recordingMarkTypes);
    return this.recordingsMarkTypeRepository.insert(marksTypes);
  }

  async drop(): Promise<any> {
    // return this.recordingsMarkTypeRepository
      // .createQueryBuilder(`TRUNCATE ${RecordingsMarkType.recordings}`)
      // .delete()
      // .from(RecordingsMarkType)
      // .where('RecordingsMarkType.id IN (:...ids)', { ids: RecordingsMarkType })
      // .execute();
  }
}