import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionProperties, OpenVidu, Recording, RecordingLayout, RecordingMode, Session, SessionProperties } from 'openvidu-node-client';
import { RecordingVideoServiceDto } from './dto/create-video-service.dto';
import { UpdateVideoServiceDto } from './dto/update-video-service.dto';
import { MarkProperties } from './video-service.interface';

@Injectable()
export class VideoServiceService {
  openVidu: OpenVidu;
  sessionProperties: SessionProperties;
  connectionProperties: ConnectionProperties;
  marksProperties: MarkProperties;
  constructor(
    private configService: ConfigService
  ) {
    this.openVidu = new OpenVidu(this.configService.get<string>('openVidu.host') + ':' + this.configService.get<string>('openVidu.port'), this.configService.get<string>('openVidu.secret'))
    this.sessionProperties = {
      recordingMode: RecordingMode.ALWAYS, // RecordingMode.ALWAYS for automatic recording or MANUAL
      defaultRecordingProperties: {
        outputMode: Recording.OutputMode.COMPOSED, // OutputMode COMPOSED_QUICK_START or COMPOSED
        recordingLayout: RecordingLayout.BEST_FIT,
        resolution: "1280x720",
        frameRate: 30,
      }
    };
    this.connectionProperties = {}
    this.marksProperties = {}
  }

  async createSession(sessionProperties: SessionProperties) {
    const createSession = await this.openVidu.createSession({
      ...this.sessionProperties,
      ...sessionProperties,
    });
    return createSession;
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

  async startRecording(recordingVideoServiceDto: RecordingVideoServiceDto) {
    return await this.openVidu.startRecording(recordingVideoServiceDto.sessionId, {
      // outputMode: Recording.OutputMode.INDIVIDUAL, // Every publisher stream is recorded in its own file
      name: recordingVideoServiceDto.sessionId + '-' + recordingVideoServiceDto.socketId,
    })
      .then(function (response) {
        return response;
      })
      .catch(error => console.error(error));
  }

  async stopRecording(recordingVideoServiceDto: RecordingVideoServiceDto) {
    return await this.openVidu.stopRecording(recordingVideoServiceDto.sessionId)
    .then(function (response) {
      // console.log(response);
      return response;
    })
    .catch(function(error) {
      // console.error(error)
      return error;
    });
  }

  getSessionById(sessionId: string) {
    return this.openVidu.activeSessions.find((session) => session.sessionId === sessionId );
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
