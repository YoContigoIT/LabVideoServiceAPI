import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GuestsConnectionService } from './guests-connection.service';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GuestsConnectionGateway {
  constructor(
    private readonly guestsConnectionService: GuestsConnectionService
  ) {}

  @SubscribeMessage('connect-guest')
  async create(@MessageBody() createGuestsConnectionDto: CreateGuestsConnectionDto) {
    const guestConnection = this.guestsConnectionService.create(createGuestsConnectionDto);

    await this.guestsConnectionService.addGuestToPriorityLine({
      uuid: createGuestsConnectionDto.uuid,
      socketId: createGuestsConnectionDto.socketId,
      priority: createGuestsConnectionDto.priority
    })
    
    return guestConnection;
  }
}
