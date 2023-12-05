import { seeder } from "nestjs-seeder";
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
import { RecordingsMarkTypeSeeder } from "./recordingMarksType.seeder";
import { RootUserSeeder } from "./rootUser.seeder";
import { Agent } from "http";
import { Role } from "src/modules/roles/entities/role.entity";
import { UserRole } from "src/modules/user-roles/entities/user-role.entity";
import { ApiKey } from "src/modules/api-key/entities/api-key.entity";
import { MySQLConnection } from "src/utilities/env/env.interface";

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forFeature([RecordingMark, RecordingsMarkType, User]),

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

        return config;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Setting])
  ],
}).run([SettingsSeeder, RecordingsMarkTypeSeeder, RootUserSeeder]);