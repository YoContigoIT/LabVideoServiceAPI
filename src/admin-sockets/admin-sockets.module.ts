import { Module } from '@nestjs/common';
import { AdminSocketsService } from './admin-sockets.service';
import { AdminSocketsGateway } from './admin-sockets.gateway';
import { AgentsConnectionModule } from 'src/modules/agents-connection/agents-connection.module';
import { GuestsConnectionModule } from 'src/modules/guests-connection/guests-connection.module';

@Module({
  imports: [AgentsConnectionModule, GuestsConnectionModule],
  providers: [AdminSocketsGateway, AdminSocketsService],
  exports: [AdminSocketsGateway],
})
export class AdminSocketsModule {}
