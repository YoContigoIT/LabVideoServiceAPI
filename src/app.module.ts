import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from './modules/users/entities/user.entity';
import { CallRecord } from './modules/call_records/entities/call_record.entity';
import { AgentsConnection } from './modules/agents-connection/entities/agents-connection.entity';
import { Guest } from './modules/guests/entities/guest.entity';
import { RecordingsMarkType } from './modules/recordings-mark-type/entities/recordings-mark-type.entity';

import configuration from './utilities/configuration';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { VideoServiceModule } from './modules/video-service/video-service.module';
import { AgentsConnectionModule } from './modules/agents-connection/agents-connection.module';
import { GuestsModule } from './modules/guests/guests.module';
import { GuestsConnectionModule } from './modules/guests-connection/guests-connection.module';
import { GuestsConnection } from './modules/guests-connection/entities/guests-connection.entity';
import { AdminSocketsModule } from './admin-sockets/admin-sockets.module';
import { RecordingsMarkTypeModule } from './modules/recordings-mark-type/recordings-mark-type.module';
import { RecordingMarkModule } from './modules/recording-mark/recording-mark.module';
import { RecordingsModule } from './modules/recordings/recordings.module';
import { RecordingMark } from './modules/recording-mark/entities/recording-mark.entity';
import { Recording } from './modules/recordings/entities/recording.entity';
import { SettingsModule } from './modules/settings/settings.module';
import { Setting } from './modules/settings/entities/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async ( configService: ConfigService ) => ({        
        type: "mysql",
        host: configService.get<string>("db.mysql.host"),
        port: parseInt(configService.get<string>("db.mysql.port")),
        username: configService.get<string>("db.mysql.username"),
        password: configService.get<string>("db.mysql.password"),
        database: configService.get<string>("db.mysql.database"),
        entities: [
          User,
          CallRecord,
          AgentsConnection,
          Guest,
          GuestsConnection,
          RecordingsMarkType,
          RecordingMark,
          Recording,
          Setting,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    VideoServiceModule,
    AgentsConnectionModule,
    GuestsModule,
    GuestsConnectionModule,
    AdminSocketsModule,
    RecordingsMarkTypeModule,
    RecordingMarkModule,
    RecordingsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
  exports: [ConfigModule],
})

export class AppModule {
  constructor(private dataSource: DataSource){}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
