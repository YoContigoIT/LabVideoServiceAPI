import { Inject, Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingsMarkType } from '../modules/recordings-mark-type/entities/recordings-mark-type.entity';
import { RecordingMark } from "src/modules/recording-mark/entities/recording-mark.entity";

@Injectable()
export class RecordingsMarkTypeSeeder implements Seeder {
    constructor(
      @InjectRepository(RecordingsMarkType) private recordingsMarkTypeRepository: Repository<RecordingsMarkType>,
    ) {}

    async drop(): Promise<any> {
      return await this.recordingsMarkTypeRepository.query(`DELETE FROM recordings_mark_type WHERE id <= 4`)
    }

    async seed(): Promise<any> {
      const recordingMarkTypes: RecordingsMarkType[] = [
          { id: '1', type: "INIT_VIDEO_CALL", typeTitle: "call init", },
          { id: '2', type: "FINISH_VIDEO_CALL", typeTitle: "call finished", },
          { id: '3', type: "START_RECORDING", typeTitle: "start recording video call", },
          { id: '4', type: "STOP_RECORDING", typeTitle: "stop recording video call", }
      ]

      // Insert into the database.
      const marksTypes = this.recordingsMarkTypeRepository.create(recordingMarkTypes);
      return this.recordingsMarkTypeRepository.insert(marksTypes);
    }
}