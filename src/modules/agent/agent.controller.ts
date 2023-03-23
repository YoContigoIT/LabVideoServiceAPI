import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { multipleGuardsReferences } from 'src/utilities/decorators/multipleGuardsReferences.decorator';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { MultipleAuthorizeGuard } from '../auth/guard/multiple-authorize.guard';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { GetAgentsDto } from './dto/get-agents.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @ApiKeyType('secret')
  @UseGuards(ApiKeyGuard)
  @Post()
  async create(@Body() createAgentDto: CreateAgentDto): Promise<HttpResponse> {
    const agent = await this.agentService.create(createAgentDto);

    if (agent?.uuid) {
      return {
        uuid: agent.uuid,
        status : HttpStatusResponse.SUCCESS
      }
    }
  }

  @ApiKeyType('secret')
  @Roles('admin')
  @UseGuards(MultipleAuthorizeGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() query: GetAgentsDto) {
    return this.agentService.findAll(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.agentService.findOne(uuid);
  }

  @Patch(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.updateAgent(uuid, updateAgentDto);
  }

  // @Patch('/password/:uuid')
  // async updatePassword(@Param('uuid') uuid: string, @Body() updatePasswordUserDto: UpdatePasswordUserDto) {
  //   return this.agentService.updatePassword(uuid, updatePasswordUserDto);
  // }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.agentService.remove(uuid);
  }
}