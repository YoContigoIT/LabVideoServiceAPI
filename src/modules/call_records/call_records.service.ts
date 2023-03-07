import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { UpdateCallRecordDto } from './dto/update-call_record.dto';
import { CallRecord } from './entities/call_record.entity';
import { FindAllCallRecordDto } from './dto/find-all-call_record.dto';
import { DashboardGraphCallRecordQueryDto } from './dto/dashboard-graph-call_record.dto';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';

@Injectable()
export class CallRecordsService {
  constructor(
    @InjectRepository(CallRecord) private callRecordRepository: Repository<CallRecord>
  ) {}
  async create(createCallRecordDto: CreateCallRecordDto) {
    const callRecordInfo = await this.callRecordRepository.save(createCallRecordDto);
    return callRecordInfo;
  }

  findAll(query: FindAllCallRecordDto) {
    const where: FindOptionsWhere<CallRecord> = {};

    if (query.agentConnectionId) {
      where.agentConnectionId = {
        id : query.agentConnectionId
      }
    }

    if(query.guestConnectionId) {
      where.guestConnectionId = {
        id : query.guestConnectionId
      }
    }

    if(query.sessionStartedAt) {
      where.sessionStartedAt
    }

    return this.callRecordRepository.find({
      relations: {
        agentConnectionId: {
          agent: true
        },
        guestConnectionId: {
          uuid: true
        }
      },
      where
    });
  }

  dashboardGraph(query: DashboardGraphCallRecordQueryDto) {
    const where: FindOptionsWhere<CallRecord> = {};

    if (query.agentConnectionId) {
      where.agentConnectionId = {
        id : query.agentConnectionId
      }
    }

    return this.callRecordRepository.query('SELECT COUNT(*) as calls, DATE(sessionStartedAt) as date FROM `call_record` GROUP BY date ORDER BY date ASC')
  }

  findOne(id: number) {
    return `This action returns a #${id} callRecord`;
  }

  async update(id: string) {
    const callRecordData = {
      sessionFinishedAt: new Date()
    }

    const response = await this.callRecordRepository
      .createQueryBuilder()
      .update(CallRecord)
      .set(callRecordData)
      .where('id = :id', { id })
      .execute();    
      
    return parseAffeceRowToHttpResponse(response.affected);
  }

  remove(id: number) {
    return `This action removes a #${id} callRecord`;
  }
}
