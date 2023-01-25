import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";
import { HttpResponse } from "src/common/interfaces/http-responses.interface";
import { UsersService } from "src/users/users.service";

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
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto, @ConnectedSocket() client: Socket) {
    const agentConnection = await this.agentsConnectionService.agentConnection(createAgentsConnectionDto);
    const user = await this.usersService.findOne(createAgentsConnectionDto.user as unknown as string);

    const roomName = await this.agentsConnectionService.getUuidv4();
    this.server.in(client.id).socketsJoin(roomName);
    
    await this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: user.uuid,
      socketId: client.id,
      agentConnectionId: agentConnection.id,
      userName: user.fullName
    })

    return agentConnection;
  }

  async handleConnection(socket: Socket) {
    
  }

  async handleDisconnect(socket: Socket): Promise<HttpResponse> {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;
    
    this.agentsConnectionService.removeRoom(room.name);

    this.server.to(room.name).disconnectSockets();

    return this.agentsConnectionService.saveAgentDisconnection(room.host.agentConnectionId);

  }
}
