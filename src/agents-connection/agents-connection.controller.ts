import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { CreateAgentsConnectionDto } from './dto/create-agents-connection.dto';
import { UpdateAgentsConnectionDto } from './dto/update-agents-connection.dto';

@Controller('agentsconnection')
export class AgentsConnectionController {
  constructor(private readonly agentsConnectionService: AgentsConnectionService) {}

  @Post(':uuid')
  connectAgent(@Param('uuid') uuid: string) {
    // return this.agentsConnectionService.connection(uuid);
  }

  // @Get()
  // findAll() {
  //   return this.agentsConnectionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.agentsConnectionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAgentsConnectionDto: UpdateAgentsConnectionDto) {
  //   return this.agentsConnectionService.update(+id, updateAgentsConnectionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentsConnectionService.remove(+id);
  // }
}
