import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/services/aws/aws.service';
import { createReadStream } from 'fs'
import { RecordingsService } from '../recordings/recordings.service';
// const fs = require('fs');

@Injectable()
export class WebhooksService {
    constructor(
        private configService: ConfigService,
        private awsService: AwsService,
        private recordingsService: RecordingsService,
    ) {}

    async uploadVideoToS3(sessionId : string, fileName: string) {
        const s3Key: string = `${fileName}_${Date.now()}`
        
        const path = `${this.configService.get('openVidu.recordingPath')}/${fileName}/${fileName}.mp4`
    
        const fileStream = createReadStream(path);
        console.log(s3Key, 'uploadVideoToS3-s3Keycc');
        
        await this.awsService.sendObjectToS3(s3Key, fileStream);

        this.recordingsService.updateURI(sessionId, { s3Key });
    }
}
