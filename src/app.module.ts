import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from './modules/users/entities/user.entity';
import { CallRecord } from './modules/call_records/entities/call_record.entity';
import { AgentsConnection } from './modules/agents-connection/entities/agents-connection.entity';
import { Guest } from './modules/guests/entities/guest.entity';
import { RecordingsMarkType } from './modules/recordings-mark-type/entities/recordings-mark-type.entity';
import { GuestsConnection } from './modules/guests-connection/entities/guests-connection.entity';
import { RecordingMark } from './modules/recording-mark/entities/recording-mark.entity';
import { Recording } from './modules/recordings/entities/recording.entity';
import { Setting } from './modules/settings/entities/setting.entity';
import { Agent } from './modules/agent/entities/agent.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Language } from './modules/languages/entities/language.entity';

import configuration from './utilities/configuration';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { VideoServiceModule } from './modules/video-service/video-service.module';
import { AgentsConnectionModule } from './modules/agents-connection/agents-connection.module';
import { GuestsModule } from './modules/guests/guests.module';
import { GuestsConnectionModule } from './modules/guests-connection/guests-connection.module';
import { AdminSocketsModule } from './admin-sockets/admin-sockets.module';
import { RecordingsMarkTypeModule } from './modules/recordings-mark-type/recordings-mark-type.module';
import { RecordingMarkModule } from './modules/recording-mark/recording-mark.module';
import { RecordingsModule } from './modules/recordings/recordings.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AgentModule } from './modules/agent/agent.module';
import { RolesModule } from './modules/roles/roles.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AwsService } from './services/aws/aws.service';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { UserRole } from './modules/user-roles/entities/user-role.entity';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { ApiKey } from './modules/api-key/entities/api-key.entity';
import { MySQLConnection } from './utilities/env/env.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async ( configService: ConfigService ) => {
        
        let config: any = {        
          type: "mysql",
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
            Agent,
            Role,
            Language,
            UserRole,
            ApiKey,
          ],
          synchronize: true,
        };

        if (configService.get<boolean>("db.mysql.useReplication")) {
          config.replication = configService.get<string>("db.mysql.replication")
        } else {
          config = { ...config,
            ...configService.get<MySQLConnection>("db.mysql.unique")
          }
        }

        console.log(config);
        
        
        return config;
      },
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
    AgentModule,
    RolesModule,
    LanguagesModule,
    WebhooksModule,
    UserRolesModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService,],
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
