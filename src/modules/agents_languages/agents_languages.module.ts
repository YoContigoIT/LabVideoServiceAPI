import { Module } from '@nestjs/common';
import { AgentsLanguagesService } from './agents_languages.service';
import { AgentsLanguagesController } from './agents_languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsLanguage } from './entities/agents_language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentsLanguage]),
  ],
  controllers: [AgentsLanguagesController],
  providers: [AgentsLanguagesService]
})
export class AgentsLanguagesModule {}
