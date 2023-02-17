import { Module } from '@nestjs/common';
import { GuestsConnectionService } from './guests-connection.service';
import { GuestsConnectionGateway } from './guests-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { AgentsConnectionService } from 'src/agents-connection/agents-connection.service';
import { AgentsConnectionModule } from 'src/agents-connection/agents-connection.module';
import { GuestsModule } from 'src/guests/guests.module';
import { VideoServiceModule } from 'src/video-service/video-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestsConnection]),
    AgentsConnectionModule,
    GuestsModule,
    VideoServiceModule,
  ],
  providers: [GuestsConnectionGateway, GuestsConnectionService],
  exports: [GuestsConnectionService]
})
export class GuestsConnectionModule {}
