import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { HttpResponse } from 'src/common/interfaces/http-responses.interface';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { Language } from '../languages/entities/language.entity';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private agentRepository: Repository<Agent>,
    private languagesService: LanguagesService
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> { 
    const languages: Language[] = [];
    for(let language of createAgentDto.languages) { 
      languages.push(await this.languagesService.findOne(language.toString()))
    }

    const agent = this.agentRepository.create(createAgentDto);

    agent.languages = languages;
    return this.agentRepository.save(agent).catch((e) => {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          { message: 'Account with this email already exists.', code: e.code },
        );
      }
      throw e;
    });
  }

  async updateAgent(uuid: string, updateAgentDto: UpdateAgentDto) {
    let agent = await this.agentRepository.findOne({ where: {uuid}});  
    
    const languages: Language[] = [];
    for(let language of updateAgentDto.languages) { 
      languages.push(await this.languagesService.findOne(language.toString()))
    }
    
    agent.languages = languages;
    delete updateAgentDto.languages;
    const response = await this.agentRepository.save({...agent, ...updateAgentDto})
      
    return parseAffeceRowToHttpResponse(response.uuid ? 1 : 0);
  }

  // async updatePassword(uuid: string, updatePasswordAgentDto: UpdatePasswordAgentDto): Promise<HttpResponse> {
  //   updatePasswordAgentDto.password = await this.hashPassword(updatePasswordAgentDto.password);

  //   const response = await this.agentRepository
  //     .createQueryBuilder()
  //     .update(Agent)
  //     .set(updatePasswordAgentDto)
  //     .where('uuid = :uuid', { uuid })
  //     .execute();

  //     return parseAffeceRowToHttpResponse(response.affected);
  // }

  findAll() {
    return this.agentRepository.find({
      relations: {
        role: true
      }
    });
  }

  findOne(uuid: string) {
    return this.agentRepository.findOne({
      where: {uuid},
      relations: {
        role: true,
        languages: true
      }
    });
  }

  async remove(uuid: string) {
    const response = await this.agentRepository.softDelete(uuid);

    return parseAffeceRowToHttpResponse(response.affected);
  }
}
