import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectionProperties,
  OpenVidu,
  Recording,
  RecordingLayout,
  RecordingMode,
  Session,
  SessionProperties,
} from 'openvidu-node-client';
import { SettingsService } from 'src/modules/settings/settings.service';
// import { MarkProperties } from './video-service.interface';

@Injectable()
export class VideoServiceService {
  openVidu: OpenVidu;
  sessionProperties: SessionProperties;
  connectionProperties: ConnectionProperties;
  // marksProperties: MarkProperties;
  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {
    this.openVidu = new OpenVidu(
      this.configService.get<string>('openVidu.host') +
        ':' +
        this.configService.get<string>('openVidu.port'),
      this.configService.get<string>('openVidu.secret'),
    );
    // this.marksProperties = {};
  }

  async createSession(sessionProperties: SessionProperties) {
    console.log('---------- createSession ----------');
    console.log({ sessionProperties });

    const settings = await this.settingsService.getSettings();
    this.sessionProperties = {
      recordingMode: settings.openViduRecordingMode as RecordingMode, // RecordingMode.ALWAYS for automatic recording or MANUAL
      defaultRecordingProperties: {
        outputMode: Recording.OutputMode.COMPOSED, // OutputMode COMPOSED_QUICK_START or COMPOSED
        recordingLayout: settings.openViduRecordingLayout as RecordingLayout,
        resolution: `${settings.openViduRecordingWidth}x${settings.openViduRecordingHeight}`,
        frameRate: settings.openViduRecordingFrameRate,
      },
    };

    let createSession: Session;
    try {
      createSession = await this.openVidu.createSession({
        ...this.sessionProperties,
        ...sessionProperties,
      });
    } catch (error) {
      console.log('---------- CreateSessionError ----------');
      console.log({ error });
      console.log('----------------------------------------');
    }

    console.log({ createSession });
    console.log('-----------------------------------');
    return createSession;
  }

  async createConnection(
    session: Session,
    connectionProperties: ConnectionProperties,
  ) {
    console.log('---------- createConnection ----------');

    const settings = await this.settingsService.getSettings();
    this.connectionProperties = {
      record: settings.openViduRecord,
    };

    try {
      if (!this.validateIfSessionExists(session)) return null;

      const connection = await session.createConnection({
        ...this.connectionProperties,
        ...connectionProperties,
      });
      console.log({ connection });
      console.log('-----------------------------------');
      return connection;
    } catch (error) {
      console.log('--------- CreateConnectionError ---------');
      console.log({ error });
      console.log('-----------------------------------------');
    }
  }

  private validateIfSessionExists(session: Session) {
    return this.openVidu.activeSessions.find(
      (sesion) => session.sessionId === sesion.sessionId,
    );
  }

  getSessions() {
    console.log('---------- getSessions ----------');
    const sessionsActives = this.openVidu.activeSessions;
    console.log({ sessionsActives });
    console.log('---------------------------------');
    return sessionsActives;
  }

  async getSessionById(sessionId: string) {
    try {
      console.log('---------- getSessionById ----------');
      const fecthSessions = await this.openVidu.fetch();
      console.log({ fecthSessions });
      console.log('------------------------------------');

      return this.openVidu?.activeSessions.find(
        (session) => session.sessionId === sessionId,
      );
    } catch (error) {
      console.log('--------- getSessionByIdError ---------');
      console.log({ error });
      console.log('-----------------------------------------');
    }
  }
}
