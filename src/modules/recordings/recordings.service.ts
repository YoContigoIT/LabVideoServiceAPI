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
    let order = {};

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
          folio: query.search
        }
      }
    }

    if (query.active === 'folio') { 
      order = {
        callRecordId : {
          guestConnectionId: {
            folio: query.direction.toUpperCase()
          }
        }
      }
    }

    if (query.active === 'time') { 
      order = {
        callRecordId : {
          sessionStartedAt: query.direction.toUpperCase()
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
      where,
      order: Object.keys(order).length ? order : {
        [query.active]: query.direction?.toUpperCase()
      }
    });

    return paginatorResponse(data, page, take);
  }

  async findAllByFolio(folio: string) {
    const where: FindOptionsWhere<Recording> = {}


    where.callRecordId = {
      guestConnectionId: {
        folio: Like(`%${folio}%`)
      }
    }
  
    const data = await this.recordingRepository.find({
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

    const _data = [];

    for(let recording of data) {
      try {
  
        if(!recording.deleteAt){
          recording['url'] = await this.awsService.getSignedURL(`${recording.uri}.mp4`);
        }
      } catch (err) {
        
        console.warn(err);
      } finally {
        _data.push(recording)
      }

    }

    return _data;
  }

  async findOne(id: string) {
    const recording = await this.recordingRepository.findOne({
      where: { id },
      relations: {
        recordingMarks: true
      }
    });

    try {

      if(!recording.deleteAt){
        recording.uri = await this.awsService.getSignedURL(`${recording.uri}.mp4`);
      }
    } catch (err) {
      console.warn(err);
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
