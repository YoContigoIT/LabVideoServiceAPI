import { Module } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { VideoServiceController } from './video-service.controller';
import { VideoServiceGateway } from './video-service.gateway';
import { RecordingMarkService } from 'src/recording-mark/recording-mark.service';

@Module({
  controllers: [VideoServiceController],
  providers: [VideoServiceGateway, VideoServiceService, RecordingMarkService],
  exports: [VideoServiceService],
})
export class VideoServiceModule {}
