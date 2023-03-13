import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayDisconnect, OnGatewayConnection, ConnectedSocket, WebSocketServer, WsException } from '@nestjs/websockets';
import { GuestsConnectionService } from './guests-connection.service';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from 'src/modules/agents-connection/agents-connection.service';
import { GuestsService } from 'src/modules/guests/guests.service';
import { VideoServiceService } from 'src/modules/video-service/video-service.service';
import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { Guest } from '../guests/entities/guest.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GuestsConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private guestsConnectionService: GuestsConnectionService,
    private agentsConnectionService: AgentsConnectionService,
    private videoServiceService: VideoServiceService,
    private guestsService: GuestsService,
  ) {}

  handleConnection(socket: Socket) {
    // throw new Error('Method not implemented.');
  }
  async handleDisconnect(socket: Socket) {
    const room = this.guestsConnectionService.getRoomByGuestSocket(socket.id);
    if (room) {
      this.guestsConnectionService.updateRoomGuest(room);
      this.agentsConnectionService.removeGuestFromRoomBySocket(socket.id);
      this.videoServiceService.getSessionById(room.sessionId)?.close();

      return;
    }

    // TODO: if esta pendiente de contestar el agente y se desconecta el guest mandar evento de llamada cancelada o algo así.$

    // TODO: Corregir error de cuando se desconecta la victima
    const guestIdx = this.guestsConnectionService.getGuestIdxBySocketId(socket.id);
    
    if (guestIdx !== -1) { 
      this.guestsConnectionService.removeGuestFromAssertivePriorityLine(guestIdx.guest, guestIdx.priorityLine);
    }
  }

  @SubscribeMessage('connect-guest')
  async create(@MessageBody() createGuestsConnectionDto: CreateGuestsConnectionDto, @ConnectedSocket() client: Socket) {

    const guest = await this.guestsService.findOne(createGuestsConnectionDto.uuid as unknown as string);
    if (!guest) throw new WsException('There is not any Guest with this UUID');
    
    const guestConnection = await this.guestsConnectionService.create(createGuestsConnectionDto);

    await this.guestsConnectionService.addGuestToPriorityLine({
      uuid: createGuestsConnectionDto.uuid,
      socketId: client.id,
      priority: createGuestsConnectionDto.priority,
      queueAt: new Date(),
      guest: guest,
      guestConnectionId : guestConnection.id
    })
    
    return guestConnection;
  }
}
