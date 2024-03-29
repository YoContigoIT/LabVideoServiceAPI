import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  HttpResponse,
  HttpStatusResponse,
} from 'src/common/interfaces/http-responses.interface';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { ApiKey, Role } from '../auth/auth.interfaces';
import { MultipleAuthorizeGuard } from '../auth/guard/multiple-authorize.guard';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { GetAgentsDto } from './dto/get-agents.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@ApiKeyType(ApiKey.SECRET)
@Roles(Role.ADMIN)
@UseGuards(MultipleAuthorizeGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async create(@Body() createAgentDto: CreateAgentDto): Promise<HttpResponse> {
    const agent = await this.agentService.create(createAgentDto);

    if (agent?.uuid) {
      return {
        uuid: agent.uuid,
        status: HttpStatusResponse.SUCCESS,
      };
    }
  }

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
  async update(
    @Param('uuid') uuid: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
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
