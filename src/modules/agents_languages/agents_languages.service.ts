import { Injectable } from '@nestjs/common';
import { CreateAgentsLanguageDto } from './dto/create-agents_language.dto';
import { UpdateAgentsLanguageDto } from './dto/update-agents_language.dto';

@Injectable()
export class AgentsLanguagesService {
  create(createAgentsLanguageDto: CreateAgentsLanguageDto) {
    return 'This action adds a new agentsLanguage';
  }

  findAll() {
    return `This action returns all agentsLanguages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agentsLanguage`;
  }

  update(id: number, updateAgentsLanguageDto: UpdateAgentsLanguageDto) {
    return `This action updates a #${id} agentsLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} agentsLanguage`;
  }
}
