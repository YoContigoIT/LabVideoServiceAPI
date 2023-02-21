import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgentsLanguagesService } from './agents_languages.service';
import { CreateAgentsLanguageDto } from './dto/create-agents_language.dto';
import { UpdateAgentsLanguageDto } from './dto/update-agents_language.dto';

@Controller('agents-languages')
export class AgentsLanguagesController {
  constructor(private readonly agentsLanguagesService: AgentsLanguagesService) {}

  @Post()
  create(@Body() createAgentsLanguageDto: CreateAgentsLanguageDto) {
    return this.agentsLanguagesService.create(createAgentsLanguageDto);
  }

  @Get()
  findAll() {
    return this.agentsLanguagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsLanguagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgentsLanguageDto: UpdateAgentsLanguageDto) {
    return this.agentsLanguagesService.update(+id, updateAgentsLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentsLanguagesService.remove(+id);
  }
}
