import { Module } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { VideoServiceController } from './video-service.controller';

@Module({
  controllers: [VideoServiceController],
  providers: [VideoServiceService]
})
export class VideoServiceModule {}
