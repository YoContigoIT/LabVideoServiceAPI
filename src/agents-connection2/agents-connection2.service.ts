import { Injectable } from '@nestjs/common';
import { CreateAgentsConnection2Dto } from './dto/create-agents-connection2.dto';
import { UpdateAgentsConnection2Dto } from './dto/update-agents-connection2.dto';

@Injectable()
export class AgentsConnection2Service {
  create(createAgentsConnection2Dto: CreateAgentsConnection2Dto) {
    return 'This action adds a new agentsConnection2';
  }

  findAll() {
    return `This action returns all agentsConnection2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agentsConnection2`;
  }

  update(id: number, updateAgentsConnection2Dto: UpdateAgentsConnection2Dto) {
    return `This action updates a #${id} agentsConnection2`;
  }

  remove(id: number) {
    return `This action removes a #${id} agentsConnection2`;
  }
}
