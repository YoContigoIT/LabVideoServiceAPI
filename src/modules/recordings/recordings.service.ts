import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/services/aws/aws.service';
import { paginatorResponse, parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CallRecord } from '../call_records/entities/call_record.entity';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { GetRecordingsDto } from './dto/get-recordings.dto';
import { UpdateRecordingDto, UpdateUriRecordingDto } from './dto/update-recording.dto';
import { Recording } from './entities/recording.entity';

@Injectable()
export class RecordingsService {
  constructor(
    @InjectRepository(Recording) private recordingRepository: Repository<Recording>,
    private readonly awsService: AwsService
  ) {}
  
  async create(createRecordingDto: CreateRecordingDto) {
    const recordingInfo = await this.recordingRepository.save(createRecordingDto);
    return recordingInfo;
  }

  async findAll(query: GetRecordingsDto) {
    const where: FindOptionsWhere<Recording> = {}
    const take = query.pageSize || 10;
    const page = query.pageIndex || 0;
    const skip = page*take;

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

    if(query.search) {
      where.callRecordId = {
        guestConnectionId: {
          folio: Like(`%${query.search}%`)
        }
      }
    }
  
    const data = await this.recordingRepository.findAndCount({
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
      take,
      skip,
      where
    });

    return paginatorResponse(data, page, take);
  }

  async findOne(id: string) {
    const recording = await this.recordingRepository.findOne({
      where: { id },
      relations: {
        recordingMarks: true
      }
    });

    if(!recording.deleteAt){
      recording.uri = await this.awsService.getSignedURL(recording.uri);
    }
    return recording;
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

  async remove(id: string) {
    const recording = await this.recordingRepository.findOne({
      where: { id: id }
    });


    if(recording) {
      const result = await this.awsService.deleteObject(recording.uri);

      if(result.$metadata.httpStatusCode === 204) {
        const response = await this.recordingRepository.softDelete(id);
        
        return parseAffeceRowToHttpResponse(response.affected);
      }  
    }
  }
}
