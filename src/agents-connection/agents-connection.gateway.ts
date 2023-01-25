import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets"
import { delay, from, interval, map, Observable } from "rxjs";
import { Server, ServerOptions, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";
import { HttpResponse } from "src/common/interfaces/http-responses.interface";
import { UsersService } from "src/users/users.service";
import { Guest } from "src/guests-connection/guests-connection.interface";

@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class AgentsConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private agentsConnectionService: AgentsConnectionService,
    private usersService: UsersService
  ) {}
  
  @SubscribeMessage('connect-agent')
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto) {
    const agentConnection = await this.agentsConnectionService.agentConnection(createAgentsConnectionDto);
    const user = await this.usersService.findOne(createAgentsConnectionDto.user as unknown as string);

    const roomName = await this.agentsConnectionService.getUuidv4();
    this.server.in(createAgentsConnectionDto.socketId).socketsJoin(roomName);
    
    await this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: user.uuid,
      socketId: createAgentsConnectionDto.socketId,
      agentConnectionId: agentConnection.id,
      userName: user.fullName
    })

    return agentConnection;
  }

  guestInRoom(socketId: string, guest: Guest) {
    this.server.in(socketId).emit('guest-connected', guest);
  }

  async handleConnection(socket: Socket) {
    
  }

  async handleDisconnect(socket: Socket): Promise<HttpResponse> {

    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;
    
    const removedRoom = this.agentsConnectionService.removeRoom(room.name);
    console.log(removedRoom);

    this.server.to(room.name).disconnectSockets();

    return this.agentsConnectionService.saveAgentDisconnection(room.host.agentConnectionId);
  }

  @SubscribeMessage('guests-accepted')
  async guestAccepted(@MessageBody() guestAcceptedDto: any) {
      
  }
}
