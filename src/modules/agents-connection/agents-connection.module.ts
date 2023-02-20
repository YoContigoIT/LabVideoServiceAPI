
import { Inject, Module } from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { AgentsConnectionController } from './agents-connection.controller';
import { AgentsConnectionGateway } from 'src/modules/agents-connection/agents-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsConnection } from './entities/agents-connection.entity';
import { AdminSocketsGateway } from 'src/admin-sockets/admin-sockets.gateway';
import { AdminSocketsModule } from 'src/admin-sockets/admin-sockets.module';
import { UsersModule } from 'src/modules/users/users.module';
import { VideoServiceModule } from 'src/modules/video-service/video-service.module';
import { CallRecordsModule } from 'src/modules/call_records/call_records.module';
import { RecordingsModule } from 'src/modules/recordings/recordings.module';
import { RecordingMarkModule } from 'src/modules/recording-mark/recording-mark.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentsConnection]),
    UsersModule,
    VideoServiceModule,
    CallRecordsModule,
    RecordingsModule,
    RecordingMarkModule,
  ],
  controllers: [AgentsConnectionController],
  providers: [AgentsConnectionService, AgentsConnectionGateway],
  exports: [AgentsConnectionService, AgentsConnectionGateway]
})
export class AgentsConnectionModule {}