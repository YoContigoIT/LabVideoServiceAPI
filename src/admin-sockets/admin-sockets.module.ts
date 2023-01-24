import { Module } from '@nestjs/common';
import { AdminSocketsService } from './admin-sockets.service';
import { AdminSocketsGateway } from './admin-sockets.gateway';
import { AgentsConnectionModule } from 'src/agents-connection/agents-connection.module';

@Module({
  imports: [AgentsConnectionModule],
  providers: [AdminSocketsGateway, AdminSocketsService],
  exports: [AdminSocketsGateway]
})
export class AdminSocketsModule {}
