import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AdminSocketsService } from './admin-sockets.service';
import { AgentsConnectionService } from 'src/agents-connection/agents-connection.service';
import { GuestsConnectionService } from 'src/guests-connection/guests-connection.service';
import { combineLatest, distinctUntilChanged, forkJoin, last, map } from 'rxjs';


@WebSocketGateway()
export class AdminSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    private adminSocketsService: AdminSocketsService,
    private agentsConnectionsService: AgentsConnectionService,
    private guestConnectionsService: GuestsConnectionService
  ) {
  }

  handleConnection(socket: Socket) {
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(socket: Socket) {
    // throw new Error('Method not implemented.');
  }

  @SubscribeMessage('register-to-rooms-updates')
  registerToRoomsUpdates(@ConnectedSocket() client: Socket) {

    this.agentsConnectionsService.rooms$
      .subscribe((rooms) => {
        client.emit('rooms-update', rooms);
      });
  }

  @SubscribeMessage('register-to-priority-line-updates')
  registerToPriorityLineUpdates(@ConnectedSocket() client: Socket) {

    this.guestConnectionsService.priorityLine$
      .subscribe((priorityLine) => {
        client.emit('priority-line-update', priorityLine);
      });
  }

  @SubscribeMessage('register-to-dashboard-updates')
  registerToDashboardUpdates(@ConnectedSocket() client: Socket) {

    combineLatest([
      this.agentsConnectionsService.rooms$,
      this.guestConnectionsService.priorityLine$
    ])
      .pipe(map(data => {
        return {
          rooms: {
            active: data[0].length,
            inCall: data[0].filter(room => !room.available).length,
            free: data[0].filter(room => room.available).length
          },
          priorityLine: data[1].length,
        }
      }))
      .subscribe(data => {        
        client.emit('dashboard-update', data);
      })
  }

}
