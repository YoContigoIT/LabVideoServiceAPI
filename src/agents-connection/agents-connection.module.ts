import { Inject, Module } from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { AgentsConnectionController } from './agents-connection.controller';
import { AgentsConnectionGateway } from 'src/agents-connection/agents-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsConnection } from './entities/agents-connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentsConnection]),
  ],
  controllers: [AgentsConnectionController],
  providers: [AgentsConnectionService, AgentsConnectionGateway]
})
export class AgentsConnectionModule {}
