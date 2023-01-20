import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';
import { CallRecord } from './call_records/entities/call_record.entity';
import { AgentsConnection } from './agents-connection/entities/agents-connection.entity';
import { Guest } from './guests/entities/guest.entity';

import configuration from './utilities/configuration';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './auth/auth.module';
import { VideoServiceModule } from './video-service/video-service.module';
import { AgentsConnectionModule } from './agents-connection/agents-connection.module';
import { GuestsModule } from './guests/guests.module';
import { GuestsConnectionModule } from './guests-connection/guests-connection.module';
import { GuestsConnection } from './guests-connection/entities/guests-connection.entity';

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
