import { Module } from '@nestjs/common';
import { GuestsConnectionService } from './guests-connection.service';
import { GuestsConnectionGateway } from './guests-connection.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestsConnection])
  ],
  providers: [GuestsConnectionGateway, GuestsConnectionService]
})
export class GuestsConnectionModule {}
