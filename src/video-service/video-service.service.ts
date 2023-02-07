import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionProperties, OpenVidu, Recording, RecordingMode, Session, SessionProperties } from 'openvidu-node-client';
import { session } from 'passport';
import { CreateVideoServiceDto } from './dto/create-video-service.dto';
import { UpdateVideoServiceDto } from './dto/update-video-service.dto';

@Injectable()
export class VideoServiceService {
  openVidu: OpenVidu;
  sessionProperties: SessionProperties;
  connectionProperties: ConnectionProperties;
  constructor(
    private configService: ConfigService
  ) {
    this.openVidu = new OpenVidu(this.configService.get<string>('openVidu.host') + ':' + this.configService.get<string>('openVidu.port'), this.configService.get<string>('openVidu.secret'))
    this.sessionProperties = {
      recordingMode: RecordingMode.MANUAL, // RecordingMode.ALWAYS for automatic recording
      defaultRecordingProperties: {
        outputMode: Recording.OutputMode.COMPOSED,
        resolution: "640x480",
        frameRate: 24
      }
    };
    this.connectionProperties = {}
  }

  createSession(sessionProperties: SessionProperties) {  
    return this.openVidu.createSession({
      ...this.sessionProperties,
      ...sessionProperties,
    });
  }

  createConnection(session: Session, connectionProperties: ConnectionProperties) {
    return session.createConnection({
      ...this.connectionProperties,
      ...connectionProperties
    });
  }

  getSessions() {
    return this.openVidu.activeSessions;
  }

  startRecording(sessionId) {
    this.openVidu.startRecording(sessionId, {
      name: "MY_RECORDING_NAME"
    })
      .then(response =>  console.log(response))
      .catch(error => console.error(error));
  }

  stopRecording() {

  }

  findAll() {
    return `This action returns all videoService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videoService`;
  }

  update(id: number, updateVideoServiceDto: UpdateVideoServiceDto) {
    return `This action updates a #${id} videoService`;
  }

  remove(id: number) {
    return `This action removes a #${id} videoService`;
  }
}
