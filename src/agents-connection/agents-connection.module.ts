import { Inject, Module } from '@nestjs/common';
import { AgentsConnectionService } from './agents-connection.service';
import { AgentsConnectionController } from './agents-connection.controller';
import { EventsGateway } from 'src/common/gateways/events.gateway';
import { ConfigService } from '@nestjs/config';
// import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

// const configService: ConfigService;
// const config: SocketIoConfig = { url: configService.get<string>('') }

@Module({
  imports: [
    // [ConfigService],
    // SocketIoModule.forRoot({
    //   // url
    // }),
    // inject: [ConfigService],
  ],
  controllers: [AgentsConnectionController],
  providers: [AgentsConnectionService, EventsGateway]
})
export class AgentsConnectionModule {}
