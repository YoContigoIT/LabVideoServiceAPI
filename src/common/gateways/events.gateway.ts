import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets"
import { delay, from, interval, map, Observable } from "rxjs";
import { Server, ServerOptions, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('connect-agent')
    handleEvents(@ConnectedSocket() client: Socket, @MessageBody() data: string): any {
        console.log({'data':data});
        console.log({'client':client});
        
        return {
            socket: client,
            uuid: data
        }
    }

    @SubscribeMessage('events')
    async findAll(@MessageBody() data: any) {
        console.log(data);

        
      return interval(1000).pipe(map(item => {
        console.log(item);
        
        return { event: 'events', data: item }
      }));
    }
  
    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
}
