import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { CallRecord } from '../call_records/entities/call_record.entity';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { GetRecordingsDto } from './dto/get-recordings.dto';
import { UpdateRecordingDto, UpdateUriRecordingDto } from './dto/update-recording.dto';
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

  findAll(query: GetRecordingsDto) {
    const where: FindOptionsWhere<Recording> = {}
    
    if(query.id) {
      where.id = query.id;
    }

    if(query.callRecordId) {
      where.callRecordId = {
        id: query.callRecordId
      }
    }

    if(query.agentConnectionId) {
      where.callRecordId = {
        agentConnectionId: {
          id: query.agentConnectionId
        }
      }
    }

    if(query.agentUuid) {
      where.callRecordId = {
        agentConnectionId: {
          agent: {
            uuid: query.agentUuid
          }
        }
      }
    }

    if(query.guestConnectionId) {
      where.callRecordId = {
        guestConnectionId: {
          id: query.guestConnectionId
        }
      }
    }
    
    if(query.guestUuid) {
      where.callRecordId = {
        guestConnectionId: {
          uuid: query.guestUuid
        }
      }
    }

    if(query.fromDate) {
      where.callRecordId = {
        sessionStartedAt: Between(
          query.fromDate,
          query.toDate || new Date()
        ),
      }
    }
  
    return this.recordingRepository.find({
      relations: {
        callRecordId: {
          agentConnectionId: {
            agent: true
          },
          guestConnectionId: {
            // guest: true
          }
        }
      },
      where
    });
  }

  findOne(id: string) {
    return this.recordingRepository.findOne({
      where: { id }
    });
  }

  findBySessionId(sessionId: string) {
    return this.recordingRepository.find({ where: { sessionId } });
  }

  async updateURI(sessionId: string, updateUriRecordingDto: UpdateUriRecordingDto) {
    let recording = await this.recordingRepository.findOne({ where: { sessionId } })
    
    return this.recordingRepository.save({ ...recording, uri: updateUriRecordingDto.s3Key });
  }

  async insertDuration(sessionId: string, updateRecordingDto: UpdateRecordingDto) {
    const recording = await this.recordingRepository.findOne({ where: { sessionId: sessionId } });

    await this.recordingRepository.save({ ...recording, duration: updateRecordingDto.duration });
    return recording;
  }

  update(id: number, updateRecordingDto: UpdateRecordingDto) {
    return `This....`;
  }

  remove(id: number) {
    return `This action removes a #${id} recording`;
  }
}
