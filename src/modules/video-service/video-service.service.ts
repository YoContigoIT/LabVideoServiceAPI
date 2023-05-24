import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionProperties, OpenVidu, Recording, RecordingLayout, RecordingMode, Session, SessionProperties } from 'openvidu-node-client';
import { SettingsService } from 'src/modules/settings/settings.service';
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
    private configService: ConfigService,
    private settingsService: SettingsService
  ) {
    console.log(this.configService.get<string>('openVidu.host'));
    
    this.openVidu = new OpenVidu(this.configService.get<string>('openVidu.host') + ':' + this.configService.get<string>('openVidu.port'), this.configService.get<string>('openVidu.secret'));
    this.marksProperties = {}
  }

  async createSession(sessionProperties: SessionProperties) {
    const settings = await this.settingsService.getSettings();
    this.sessionProperties = {
      recordingMode: settings.openViduRecordingMode as RecordingMode, // RecordingMode.ALWAYS for automatic recording or MANUAL
      defaultRecordingProperties: {
        outputMode: Recording.OutputMode.COMPOSED, // OutputMode COMPOSED_QUICK_START or COMPOSED
        recordingLayout: settings.openViduRecordingLayout as RecordingLayout,
        resolution: `${settings.openViduRecordingWidth}x${settings.openViduRecordingHeight}`,
        frameRate: settings.openViduRecordingFrameRate,
      }
    };

    let createSession: Session;
    try {

      createSession = await this.openVidu.createSession({
        ...this.sessionProperties,
        ...sessionProperties,
      });
    } catch (error) {      
      console.warn(error);
    }
    return createSession;
  }

  async createConnection(session: Session, connectionProperties: ConnectionProperties) {
    const settings = await this.settingsService.getSettings();
    this.connectionProperties = {
      record: settings.openViduRecord
    }

    try {

      if (!this.validateIfSessionExists(session)) return null;

      return await session.createConnection({
        ...this.connectionProperties,
        ...connectionProperties,
      });
    } catch (error) {
      return null;
    }
  }

  private validateIfSessionExists(session: Session) {
    return this.openVidu.activeSessions.find(sesion => session.sessionId === sesion.sessionId);
  }

  getSessions() {
    return this.openVidu.activeSessions;
  }

  async getSessionById(sessionId: string) {
    try {
      await this.openVidu.fetch();
      return this.openVidu?.activeSessions.find((session) => session.sessionId === sessionId);
    } catch (error) {
      console.warn(error);
    }
  }
}
