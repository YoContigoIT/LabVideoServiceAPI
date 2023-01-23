import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets"
import { delay, from, interval, map, Observable } from "rxjs";
import { Server, ServerOptions, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";

@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class AgentsConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private agentsConnectionService: AgentsConnectionService
  ) {}
  
  @SubscribeMessage('connect-agent')
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto) {
    const joinRoom = this.server.in(createAgentsConnectionDto.socketId).socketsJoin('room');
    const roomName = this.agentsConnectionService.getUuidv4();
    
    await this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: createAgentsConnectionDto.user as unknown as string,
      socketId: createAgentsConnectionDto.socketId
    })

    return this.agentsConnectionService.connection(createAgentsConnectionDto);
  }

  async handleConnection(socket: Socket) {
    console.log(`connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    console.log(`Socket disconnected: ${socket.id}`)
  }
}
