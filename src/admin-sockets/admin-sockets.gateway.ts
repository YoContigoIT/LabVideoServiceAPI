import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AdminSocketsService } from './admin-sockets.service';
import { AgentsConnectionService } from 'src/modules/agents-connection/agents-connection.service';
import { GuestsConnectionService } from 'src/modules/guests-connection/guests-connection.service';
import { combineLatest, distinctUntilChanged, forkJoin, last, map, Subscription, take, takeUntil } from 'rxjs';


@WebSocketGateway()
export class AdminSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  dashboardConnection: Subscription;

  constructor(
    private adminSocketsService: AdminSocketsService,
    private agentsConnectionsService: AgentsConnectionService,
    private guestConnectionsService: GuestsConnectionService
  ) {
  }

  handleConnection(socket: Socket) {
    // console.log('connectiong');
    
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(socket: Socket) {
    // console.log('disconnectig')
    this.dashboardConnection?.unsubscribe();
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

    this.dashboardConnection = combineLatest([
      this.agentsConnectionsService.rooms$,
      this.guestConnectionsService.priorityLine$,
      ...this.guestConnectionsService.priorityLine.map(pl => pl.priorityLine.asObservable())
    ])
      .pipe(map(([rooms, mainPriorityLain, ..._]) => {
        return {
          rooms: {
            active: rooms.length,
            inCall: rooms.filter(room => !room.available).length,
            free: rooms.filter(room => room.available).length
          },
          priorityLine: mainPriorityLain.length,
          
          priorityLines: mainPriorityLain.map(pl => ({
            gender: pl.gender,
            language: pl.language,
            length: pl.priorityLine.value.length
          }))
        }
      }))
      .subscribe(data => {    
        client.emit('dashboard-update', data);
      })
  }

}
