import { Module } from '@nestjs/common';
import { GuestsConnectionService } from './guests-connection.service';
import { GuestsConnectionGateway } from './guests-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { AgentsConnectionService } from 'src/agents-connection/agents-connection.service';
import { AgentsConnectionModule } from 'src/agents-connection/agents-connection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestsConnection]),
    AgentsConnectionModule,
  ],
  providers: [GuestsConnectionGateway, GuestsConnectionService],
  exports: [GuestsConnectionService]
})
export class GuestsConnectionModule {}
