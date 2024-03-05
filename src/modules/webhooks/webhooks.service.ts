import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/services/aws/aws.service';
import { RecordingsService } from '../recordings/recordings.service';

@Injectable()
export class WebhooksService {
  constructor(
    private configService: ConfigService,
    private awsService: AwsService,
    private recordingsService: RecordingsService,
  ) {}

  async uploadVideoToS3(sessionId: string, fileName: string) {
    const s3Key = `${fileName}_${Date.now()}`;

    // const path = `${this.configService.get('openVidu.recordingPath')}/${fileName}/${fileName}.mp4`

    // const fileStream = createReadStream(path);
    // console.log(s3Key, 'uploadVideoToS3-s3Keycc');

    // await this.awsService.sendObjectToS3(s3Key, fileStream);

    this.awsService.exectPutObjectCommandInEC2Instance(fileName, s3Key);

    this.recordingsService.updateURI(sessionId, { s3Key });
  }
}
