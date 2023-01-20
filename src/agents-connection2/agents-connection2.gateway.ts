import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AgentsConnection2Service } from './agents-connection2.service';
import { CreateAgentsConnection2Dto } from './dto/create-agents-connection2.dto';
import { UpdateAgentsConnection2Dto } from './dto/update-agents-connection2.dto';

@WebSocketGateway()
export class AgentsConnection2Gateway {
  constructor(private readonly agentsConnection2Service: AgentsConnection2Service) {}

  @SubscribeMessage('createAgentsConnection2')
  create(@MessageBody() createAgentsConnection2Dto: CreateAgentsConnection2Dto) {
    return this.agentsConnection2Service.create(createAgentsConnection2Dto);
  }

  @SubscribeMessage('findAllAgentsConnection2')
  findAll() {
    return this.agentsConnection2Service.findAll();
  }

  @SubscribeMessage('findOneAgentsConnection2')
  findOne(@MessageBody() id: number) {
    return this.agentsConnection2Service.findOne(id);
  }

  @SubscribeMessage('updateAgentsConnection2')
  update(@MessageBody() updateAgentsConnection2Dto: UpdateAgentsConnection2Dto) {
    return this.agentsConnection2Service.update(updateAgentsConnection2Dto.id, updateAgentsConnection2Dto);
  }

  @SubscribeMessage('removeAgentsConnection2')
  remove(@MessageBody() id: number) {
    return this.agentsConnection2Service.remove(id);
  }
}
