import { seeder } from "nestjs-seeder";
import { RecordingsMarkTypeSeeder } from "./recordingMarksType.seeder";
import { RecordingsMarkType } from '../modules/recordings-mark-type/entities/recordings-mark-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "src/utilities/configuration";
import { RecordingMark } from "src/modules/recording-mark/entities/recording-mark.entity";
import { GuestsConnection } from "src/modules/guests-connection/entities/guests-connection.entity";
import { Guest } from "src/modules/guests/entities/guest.entity";
import { AgentsConnection } from "src/modules/agents-connection/entities/agents-connection.entity";
import { CallRecord } from "src/modules/call_records/entities/call_record.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Recording } from "src/modules/recordings/entities/recording.entity";
import { Setting } from "src/modules/settings/entities/setting.entity";
import { SettingsSeeder } from "./settings.seeder";
import { LanguagesSeeder } from "./languages.seeder";
import { Language } from "src/modules/languages/entities/language.entity";

seeder({
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
    TypeOrmModule.forFeature([RecordingsMarkType, Setting])
  ],
}).run([RecordingsMarkTypeSeeder, SettingsSeeder]);