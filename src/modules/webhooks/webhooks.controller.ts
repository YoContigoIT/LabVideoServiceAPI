import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AwsService } from 'src/services/aws/aws.service';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { ApiKey, Role } from '../auth/auth.interfaces';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { RecordingMarkService } from '../recording-mark/recording-mark.service';
import { RecordingsService } from '../recordings/recordings.service';
import { OpenViduWebHookEvent, OpenViduWebHookEventTypes, RecordingStatusChangedStatusTypes } from './webhooks.interface';
import { WebhooksService } from './webhooks.service';

@ApiKeyType(ApiKey.SECRET)
@UseGuards(ApiKeyGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly recordingsService: RecordingsService,
    private readonly recordingsMarkService: RecordingMarkService,
    private awsService: AwsService,
  ) {}

  @Post('/openvidu')
  async openvidu(@Body() eventData: OpenViduWebHookEvent, @Res() response: Response) {
    switch(eventData.event) {
      case OpenViduWebHookEventTypes.recordingStatusChanged:
        // console.log('===========================****===========================');
        // console.log(eventData);
        
        if(eventData.status === RecordingStatusChangedStatusTypes.ready) {  
          try {
            
            this.webhooksService.uploadVideoToS3(eventData.sessionId, eventData.name);
            
            const recordingInfo = await this.recordingsService.insertDuration(eventData.sessionId,{ duration: eventData.duration } )
            const seconds = this.recordingsMarkService.seconsToString(eventData.duration);
            
            this.recordingsMarkService.create({
              markTime: seconds,
              recordingMarkTypeId: '2',
              recordingId: recordingInfo.id,
            });
          } catch (err) {
            console.warn(err);
          }
        }

        return response.status(HttpStatus.OK).send(eventData);
      default:
        return response.status(HttpStatus.NOT_IMPLEMENTED).send(eventData);
    }
  }
}
