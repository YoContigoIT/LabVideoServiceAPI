import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayDisconnect, OnGatewayConnection, ConnectedSocket, WebSocketServer, WsException } from '@nestjs/websockets';
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { GuestsConnectionService } from './guests-connection.service';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from 'src/modules/agents-connection/agents-connection.service';
import { GuestsService } from 'src/modules/guests/guests.service';
import { VideoServiceService } from 'src/modules/video-service/video-service.service';
import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { Guest } from '../guests/entities/guest.entity';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { ApiKey } from '../auth/auth.interfaces';

@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
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
    @Inject(forwardRef(() => AgentsConnectionService))
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
      this.server.to(room.host.socketId).emit('guest-disconnected');
    } else {
      const guestIdx = this.guestsConnectionService.getGuestIdxBySocketId(socket.id);
      if (guestIdx !== -1) { 
        this.guestsConnectionService.removeGuestFromAssertivePriorityLine(guestIdx.guest, guestIdx.priorityLine);
      }
    }
    
    if (false) {
      this.guestsConnectionService.updateRoomGuest(room);
      this.agentsConnectionService.removeGuestFromRoomBySocket(socket.id);
      const OVSession = this.videoServiceService.getSessionById(room.sessionId)
      
      if(!OVSession){
        this.server.to(room.host.socketId).emit('aborted-call');
        return;
      }

      if(OVSession.activeConnections.length) {
        OVSession.close()
        if (room.users[0].guestConnectionId) {
          this.guestsConnectionService.updateGuestConnection(room.users[0].guestConnectionId, { endTimeConnection: new Date()})
        }

      };
      return;
    }
  }

  @SubscribeMessage('connect-guest')
  async create(@MessageBody() createGuestsConnectionDto: CreateGuestsConnectionDto, @ConnectedSocket() client: Socket) {
    const guest = await this.guestsService.findOne(createGuestsConnectionDto.uuid as any);
    if (!guest) throw new WsException('There is not any Guest with this UUID');    

    console.log(createGuestsConnectionDto);
    

    if (createGuestsConnectionDto.sessionId) {

      const session = this.guestsConnectionService.getSessionToReconnect(createGuestsConnectionDto.sessionId);

      if(session) {
        try {
          const connection = await this.videoServiceService.createConnection(session.session, {});
          const guestConnection = await this.guestsConnectionService.findGuestConnectionBySessionId(createGuestsConnectionDto.sessionId);

          const room = this.agentsConnectionService.findRoomBySessionId(createGuestsConnectionDto.sessionId);
          
          const user = room.users?.findIndex(user => user.guest.uuid === (createGuestsConnectionDto.uuid as any));

          
          if (user != -1) {
            
            client.emit('video-ready', {
              token: connection.token,
              connectionId: connection.connectionId,
              sessionId: session.session.sessionId,
              agent: {
                name: session.room.host.agent.fullName,
                role: session.room.host.agent.role.title
              }
            });

            room.users[user].socketId = client.id;


            this.agentsConnectionService.updateRoom(room.name, room);
            return { guest, guestConnection };
          }
        } catch (err) {
          // console.warn(err);
        }
      }
    }

    createGuestsConnectionDto.ip = client.handshake.headers['x-forwarded-for'] as string || client.handshake.address;

    const guestConnection = await this.guestsConnectionService.create(createGuestsConnectionDto);

    await this.guestsConnectionService.addGuestToPriorityLine({
      uuid: createGuestsConnectionDto.uuid,
      socketId: client.id,
      priority: createGuestsConnectionDto.priority,
      queueAt: new Date(),
      guest,
      guestConnectionId : guestConnection.id,
      details: guestConnection.details,
      guestConnection
    })
    
    return { guestConnection, guest };
  }

  @SubscribeMessage('disconnect-call')
  updateGuestConnection(@MessageBody() id: string) {
    return this.guestsConnectionService.updateGuestConnection(id, {
      endTimeConnection: new Date()
    });
  }
}
