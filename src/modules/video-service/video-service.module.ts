import { forwardRef, Module } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { VideoServiceController } from './video-service.controller';
import { VideoServiceGateway } from './video-service.gateway';
import { RecordingMarkModule } from 'src/modules/recording-mark/recording-mark.module';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { AuthModule } from '../auth/auth.module';
import { AgentsConnectionModule } from '../agents-connection/agents-connection.module';

@Module({
  imports: [
    RecordingMarkModule,
    SettingsModule,
    AuthModule,
    forwardRef(() => AgentsConnectionModule),
  ],
  controllers: [VideoServiceController],
  providers: [VideoServiceGateway, VideoServiceService],
  exports: [VideoServiceService],
})
export class VideoServiceModule {}
