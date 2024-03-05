import {
  Controller,
  Get,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { ListAgentsConnectionsDto } from './dto/list-agents-conections.dto';

@Controller('agentsconnection')
export class AgentsConnectionController {
  constructor(
    private readonly agentsConnectionService: AgentsConnectionService,
  ) {}

  // @Post(':uuid')
  // connectAgent(@Param('uuid') uuid: string) {
  //   return this.agentsConnectionService.connection(uuid);
  // }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: ListAgentsConnectionsDto) {
    return this.agentsConnectionService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  // return this.agentsConnectionService.findOne(+id);
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
