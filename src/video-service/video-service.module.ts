import { Module } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { VideoServiceController } from './video-service.controller';
import { VideoServiceGateway } from './video-service.gateway';

@Module({
  controllers: [VideoServiceController],
  providers: [VideoServiceGateway, VideoServiceService],
  exports: [VideoServiceService],
})
export class VideoServiceModule {}
