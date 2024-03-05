import { forwardRef, Module } from '@nestjs/common';
import { GuestsConnectionService } from './guests-connection.service';
import { GuestsConnectionGateway } from './guests-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { AgentsConnectionModule } from 'src/modules/agents-connection/agents-connection.module';
import { GuestsModule } from 'src/modules/guests/guests.module';
import { VideoServiceModule } from 'src/modules/video-service/video-service.module';
import { LanguagesModule } from '../languages/languages.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestsConnection]),
    GuestsModule,
    LanguagesModule,
    AuthModule,
    forwardRef(() => AgentsConnectionModule),
    forwardRef(() => VideoServiceModule),
  ],
  providers: [GuestsConnectionGateway, GuestsConnectionService],
  exports: [GuestsConnectionService, GuestsConnectionGateway],
})
export class GuestsConnectionModule {}
