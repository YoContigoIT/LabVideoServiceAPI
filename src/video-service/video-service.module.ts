import { Module } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { VideoServiceController } from './video-service.controller';
import { VideoServiceGateway } from './video-service.gateway';
import { RecordingMarkModule } from 'src/recording-mark/recording-mark.module';

@Module({
  imports: [RecordingMarkModule],
  controllers: [VideoServiceController],
  providers: [VideoServiceGateway, VideoServiceService],
  exports: [VideoServiceService],
})
export class VideoServiceModule {}
