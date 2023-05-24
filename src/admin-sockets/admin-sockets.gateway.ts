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

  roomsSubscriptions: { [key: string ]:Subscription } = {};
  priorityLineSubscriptions:  { [key: string ]:Subscription } = {};

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
    // this.dashboardConnection?.unsubscribe();
    try {
      if (this.roomsSubscriptions[socket.id]) {
        this.roomsSubscriptions[socket.id]?.unsubscribe();
        delete this.roomsSubscriptions[socket.id];
      } else if (this.priorityLineSubscriptions[socket.id]) {
        this.priorityLineSubscriptions[socket.id]?.unsubscribe();
        delete this.priorityLineSubscriptions[socket.id];
      }

    } catch(e) {}
  }

  @SubscribeMessage('register-to-rooms-updates')
  registerToRoomsUpdates(@ConnectedSocket() client: Socket) {

    this.roomsSubscriptions[client.id] = this.agentsConnectionsService.rooms$
      .subscribe((rooms) => {
        client.emit('rooms-update', rooms);
      });
  }

  @SubscribeMessage('register-to-priority-line-updates')
  registerToPriorityLineUpdates(@ConnectedSocket() client: Socket) {

    this.priorityLineSubscriptions[client.id] = combineLatest([
      this.guestConnectionsService.priorityLine$,
      ...this.guestConnectionsService.priorityLine.map(pl => pl.priorityLine.asObservable())
    ])
      .pipe(map(([mainPriorityLine, ..._]) => mainPriorityLine.map(pl => ({
        gender: pl.gender,
        language: pl.language,
        guests: pl.priorityLine.value,
        length: pl.priorityLine.value.length
      }))))
      .subscribe((priorityLine) => {
        console.log('ADMIN priorityLine----->>>',priorityLine);
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
      .pipe(map(([rooms, mainPriorityLine, ..._]) => {
        return {
          rooms: {
            active: rooms.length,
            inCall: rooms.filter(room => !room.available).length,
            free: rooms.filter(room => room.available).length
          },
          priorityLine: mainPriorityLine.length,
          
          priorityLines: mainPriorityLine.map(pl => ({
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
