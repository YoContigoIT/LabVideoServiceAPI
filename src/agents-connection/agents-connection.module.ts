import { Inject, Module } from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { AgentsConnectionController } from './agents-connection.controller';
import { AgentsConnectionGateway } from 'src/agents-connection/agents-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsConnection } from './entities/agents-connection.entity';
import { AdminSocketsGateway } from 'src/admin-sockets/admin-sockets.gateway';
import { AdminSocketsModule } from 'src/admin-sockets/admin-sockets.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentsConnection]),
    UsersModule
  ],
  controllers: [AgentsConnectionController],
  providers: [AgentsConnectionService, AgentsConnectionGateway],
  exports: [AgentsConnectionService, AgentsConnectionGateway]
})
export class AgentsConnectionModule {}
