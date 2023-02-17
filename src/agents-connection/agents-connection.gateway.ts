import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";
import { HttpResponse } from "src/common/interfaces/http-responses.interface";
import { UsersService } from "src/users/users.service";
import { Guest } from "src/guests-connection/guests-connection.interface";
import { Room } from "./agents-connection.interface";
import { getUuidv4 } from "src/utilities/helpers";
import { VideoServiceService } from "src/video-service/video-service.service";
import { CreateVideoServiceDto } from "src/video-service/dto/create-video-service.dto";
import { CreateCallRecordDto } from "src/call_records/dto/create-call_record.dto";
import { CallRecordsService } from "src/call_records/call_records.service";
import { RecordingsService } from "src/recordings/recordings.service";
import { RecordingMarkService } from "src/recording-mark/recording-mark.service";
import { RecordingsMarkTypeSeeder } from "../seeder/recordingMarksType.seeder";

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
    private usersService: UsersService,
    private videoServiceService: VideoServiceService,
    private callRecordService: CallRecordsService,
    private recordingService: RecordingsService,
    private recordingMarkService: RecordingMarkService,
  ) {}

  async handleConnection(socket: Socket) {
    
  }

  async handleDisconnect(socket: Socket): Promise<HttpResponse> {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;
    
    this.agentsConnectionService.removeRoom(room.name);

    if (room.sessionId)
        await this.videoServiceService.getSessionById(room.sessionId).close();

    this.server.to(room.name).disconnectSockets();

    return this.agentsConnectionService.saveAgentDisconnection(room.host.agentConnectionId);
  }
  
  @SubscribeMessage('connect-agent')
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto, @ConnectedSocket() client: Socket) {
    createAgentsConnectionDto.ip = client.handshake.headers['x-forwarded-for'] as string || client.handshake.address;
    const agentConnection = await this.agentsConnectionService.agentConnection(createAgentsConnectionDto);
    const user = await this.usersService.findOne(createAgentsConnectionDto.user as unknown as string);

    const roomName = await getUuidv4();
    this.server.in(client.id).socketsJoin(roomName);

    this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: user.uuid,
      socketId: client.id,
      agentConnectionId: agentConnection.id,
      userName: user.fullName
    })

    return agentConnection;
  }

  guestInRoom(room: Room, guest: Guest) {
    this.server.in(guest.socketId).socketsJoin(room.name);
    this.server.in(room.host.socketId).emit('guest-connected', guest);
  }

  @SubscribeMessage('connect-call')
  async connectCall(@MessageBody() createVideoServiceDto: CreateVideoServiceDto, @ConnectedSocket() client: Socket) {
    const session = await this.videoServiceService.createSession(createVideoServiceDto);
    const connection = await this.videoServiceService.createConnection(session, {});
    
    const room = this.agentsConnectionService.getRoomByHostSocket(client.id);
    
    const callRecordInfo = await this.callRecordService.create({
      agentConnectionId : room.host.agentConnectionId as any,
      guestConnectionId: room.users[0].guestConnectionId as any,
      sessionStartedAt : new Date(),
    });

    const recordingInfo = await this.recordingService.create({ callRecordId: callRecordInfo.id.toString() });

    this.recordingMarkService.create({ 
      markTime: '00:00:00',
      recordingMarkTypeId: '1',
      recordingId: recordingInfo.id,
    });

    

    if (!room) return;
    const sockets = await this.server.in(room.name).fetchSockets()    

    sockets.forEach(async socket => {
      if(socket.id !== client.id) {
        const connection = await this.videoServiceService.createConnection(session, {});

        socket.emit('video-ready', {
          token: connection.token,
          connectionId: connection.connectionId,
        })
      }
    });

    this.agentsConnectionService.updateSessionIdOnRoom(session.sessionId, room.name);
    

    return {
      sessionId: session.sessionId,
      token: connection.token,
      connectionId: connection.connectionId,
      recordingId: recordingInfo.id,
    }
  }

  @SubscribeMessage('guests-accepted')
  async guestAccepted(@MessageBody() guestAcceptedDto: any) {
      
  }
}
