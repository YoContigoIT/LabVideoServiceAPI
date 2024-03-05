import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { CallRecord } from './entities/call_record.entity';
import { FindAllCallRecordDto } from './dto/find-all-call_record.dto';
import { DashboardGraphCallRecordQueryDto } from './dto/dashboard-graph-call_record.dto';
import {
  paginatorResponse,
  parseAffeceRowToHttpResponse,
} from 'src/utilities/helpers';

@Injectable()
export class CallRecordsService {
  constructor(
    @InjectRepository(CallRecord)
    private callRecordRepository: Repository<CallRecord>,
  ) {}
  async create(createCallRecordDto: CreateCallRecordDto) {
    return await this.callRecordRepository.save(createCallRecordDto);
  }

  async findAll(query: FindAllCallRecordDto) {
    const where: FindOptionsWhere<CallRecord> = {};

    const take = query.pageSize || 10;
    const page = query.pageIndex || 0;
    const skip = page * take;

    if (query.agentConnectionId) {
      where.agentConnectionId = {
        id: query.agentConnectionId,
      };
    }

    if (query.guestConnectionId) {
      where.guestConnectionId = {
        id: query.guestConnectionId,
      };
    }

    if (query.agentUuid) {
      where.agentConnectionId = {
        agent: {
          uuid: query.agentUuid,
        },
      };
    }

    if (query.guestUuid) {
      where.guestConnectionId = {
        uuid: {
          uuid: query.guestUuid,
        },
      };
    }

    if (query.sessionStartedFrom) {
      where.sessionStartedAt = Between(
        query.sessionStartedFrom,
        query.sessionStartedTo || new Date(),
      );
    }

    if (query.sessionFinishedFrom) {
      where.sessionFinishedAt = Between(
        query.sessionFinishedFrom,
        query.sessionFinishedTo || new Date(),
      );
    }

    const data = await this.callRecordRepository.findAndCount({
      relations: {
        agentConnectionId: {
          agent: true,
        },
        guestConnectionId: {
          uuid: true,
        },
      },
      take: query.paginate ? take : 0,
      skip: query.paginate ? skip : 0,
      where,
    });

    return paginatorResponse(data, page, take);
  }

  dashboardGraph(query: DashboardGraphCallRecordQueryDto) {
    const where: FindOptionsWhere<CallRecord> = {};

    if (query.agentConnectionId) {
      where.agentConnectionId = {
        id: query.agentConnectionId,
      };
    }

    return this.callRecordRepository.query(
      'SELECT COUNT(*) as calls, DATE(sessionStartedAt) as date FROM `call_record` GROUP BY date ORDER BY date ASC',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} callRecord`;
  }

  async update(id: number) {
    const callRecordData = {
      sessionFinishedAt: new Date(),
    };

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

  findCallRecordByGuestConnectionId(id: string) {
    return this.callRecordRepository.findOne({
      where: {
        guestConnectionId: {
          id,
        },
      },
    });
  }
}
