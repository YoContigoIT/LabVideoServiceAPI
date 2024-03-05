import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { GuestsConnectionService } from './guests-connection.service';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { Server, Socket } from 'socket.io';
import { GuestsService } from '../guests/guests.service';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { ApiKey } from '../auth/auth.interfaces';

import { AgentsConnectionGateway } from '../agents-connection/agents-connection.gateway';
import { UUID } from 'crypto';

@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
@WebSocketGateway({
  namespace: '/guest',
  cors: {
    origin: '*',
  },
})
export class GuestsConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private guestsConnectionService: GuestsConnectionService,
    @Inject(forwardRef(() => AgentsConnectionGateway))
    private agentsConnectionGateway: AgentsConnectionGateway,
    private guestsService: GuestsService,
  ) {}

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('--------- connect_guest ---------');
    console.log({
      connection: true,
      socket: socket.id,
    });
    console.log('--------- connect_guest ---------');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('--------- handleDisconnect GUEST ---------');
    const room = this.guestsConnectionService.getRoomByGuestSocket(socket.id);

    if (room) {
      this.agentsConnectionGateway.server
        .to(room.host.socketId)
        .emit('guest-disconnected');

      // const guestRemoved = room.users.splice(0, 1)[0];
      room.available = true;
    } else {
      const guestIdx = this.guestsConnectionService.getGuestIdxBySocketId(
        socket.id,
      );

      if (guestIdx !== -1) {
        this.guestsConnectionService.removeGuestFromAssertivePriorityLine(
          guestIdx.guest,
          guestIdx.priorityLine,
        );
      }
    }

    socket.disconnect(true);
  }

  @SubscribeMessage('connect-guest')
  async create(
    @MessageBody() createGuestsConnectionDto: CreateGuestsConnectionDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('----- socket-GUEST -----');
    console.log({ client: client.id });
    console.log('----- socket-GUEST -----');

    const guest = await this.guestsService.findOne(
      createGuestsConnectionDto.uuid as any,
    );

    if (!guest) throw new WsException('There is not any Guest with this UUID');

    const linedGuest =
      this.guestsConnectionService.findGuestInPriorityLineByUuid(
        createGuestsConnectionDto.uuid as any,
      );

    if (linedGuest) {
      console.log('ERROR-ALREADY-CONNET');

      throw new WsException({
        message: 'The Guest is already connect',
        error: 'ALREADY_CONNECTED',
      });
    }

    createGuestsConnectionDto.ip =
      (client.handshake.headers['x-forwarded-for'] as string) ||
      client.handshake.address;

    const guestConnection = await this.guestsConnectionService.create(
      createGuestsConnectionDto,
    );

    await this.guestsConnectionService.addGuestToPriorityLine({
      uuid: createGuestsConnectionDto.uuid,
      socketId: client.id,
      priority: createGuestsConnectionDto.priority,
      queueAt: new Date(),
      guest,
      guestConnectionId: guestConnection.id,
      details: guestConnection.details,
      guestConnection,
    });

    return { guestConnection, guest };
  }

  @SubscribeMessage('toggle-video-guest')
  async toggleVideoGuest(
    @MessageBody() toggleVideoGuestData,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = this.guestsConnectionService.getRoomByGuestSocket(socket.id);
    // console.log(room, 'room');

    this.agentsConnectionGateway.server
      .to(room.host.socketId)
      .emit('mute-video', { toggleVideo: toggleVideoGuestData });
    this.server
      .to(socket.id)
      .emit('mute-video', { toggleVideo: toggleVideoGuestData });

    return toggleVideoGuestData;
  }

  @SubscribeMessage('disconnect-call')
  updateGuestConnection(@MessageBody() id: string) {
    return this.guestsConnectionService.updateGuestConnection(id, {
      endTimeConnection: new Date(),
    });
  }

  @SubscribeMessage('check-proprity-line')
  checkPriorityLine(
    @MessageBody() guestUUID: UUID,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('-----Check-priority-line----');
    console.log({ client });
    console.log('-----Check-priority-line----');

    return this.guestsConnectionService.existsInPriorityLine(guestUUID);
  }
}
