import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { AwsService } from 'src/services/aws/aws.service';
import { RecordingsModule } from '../recordings/recordings.module';
import { RecordingMarkModule } from '../recording-mark/recording-mark.module';

@Module({
  imports: [RecordingsModule, RecordingMarkModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, AwsService]
})
export class WebhooksModule {}
