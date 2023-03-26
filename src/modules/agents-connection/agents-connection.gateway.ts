import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";
import { HttpResponse } from "src/common/interfaces/http-responses.interface";
import { UsersService } from "src/modules/users/users.service";
import { Guest } from "src/modules/guests-connection/guests-connection.interface";
import { Room } from "./agents-connection.interface";
import { getUuidv4 } from "src/utilities/helpers";
import { VideoServiceService } from "src/modules/video-service/video-service.service";
import { CreateVideoServiceDto } from "src/modules/video-service/dto/create-video-service.dto";
import { CreateCallRecordDto } from "src/modules/call_records/dto/create-call_record.dto";
import { CallRecordsService } from "src/modules/call_records/call_records.service";
import { RecordingsService } from "src/modules/recordings/recordings.service";
import { RecordingMarkService } from "src/modules/recording-mark/recording-mark.service";
import { RecordingsMarkTypeSeeder } from "../../seeder/recordingMarksType.seeder";
import { AgentService } from "../agent/agent.service";
import { CallRecord } from "../call_records/entities/call_record.entity";
import { GuestsConnectionService } from "../guests-connection/guests-connection.service";
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { ApiKeyType } from "src/utilities/decorators/apiKeyType.decorator";
import { ApiKeyGuard } from "../auth/guard/apikey.guard";
import { ApiKey } from "../auth/auth.interfaces";

@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
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
    @Inject(forwardRef(() => GuestsConnectionService))
    private guestsConnectionService: GuestsConnectionService,
    private usersService: UsersService,
    private videoServiceService: VideoServiceService,
    private callRecordService: CallRecordsService,
    private recordingService: RecordingsService,
    private recordingMarkService: RecordingMarkService,
    private agentsService: AgentService,
  ) {}

  async handleConnection(socket: Socket) {
    
  }

  async handleDisconnect(socket: Socket): Promise<HttpResponse> {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;
    
    this.agentsConnectionService.removeRoom(room.name);

    if (room.sessionId){
      const OVSession = this.videoServiceService.getSessionById(room.sessionId);

      if(OVSession.activeConnections.length) OVSession.close();
      return;
    }

    this.server.to(room.name).disconnectSockets();

    await this.agentsConnectionService.saveAgentDisconnection(room.host.agentConnectionId);

    await this.callRecordService.update(room.host.agentConnectionId);
  }
  
  @SubscribeMessage('connect-agent')
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto, @ConnectedSocket() client: Socket) {
    createAgentsConnectionDto.ip = client.handshake.headers['x-forwarded-for'] as string || client.handshake.address;
    
    const agent = await this.agentsService.findOne(createAgentsConnectionDto.agent as any);
    if (!agent) throw new WsException('There is not any Agent with this UUID');

    const agentConnection = await this.agentsConnectionService.agentConnection(createAgentsConnectionDto);

    // const user = await this.usersService.findOne(createAgentsConnectionDto.user as unknown as string);

    const roomName = await getUuidv4();
    this.server.in(client.id).socketsJoin(roomName);

    this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: agent.uuid,
      socketId: client.id,
      agentConnectionId: agentConnection.id,
      agent: agent
    });

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

    const callRecordId = callRecordInfo.id as any as CallRecord;

    const recordingInfo = await this.recordingService.create({ callRecordId: callRecordId, sessionId: session.sessionId });

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

  @SubscribeMessage('refuse-call')
  queueGuestReconnect(@MessageBody() body: { requeue?:boolean }, @ConnectedSocket() socket: Socket) {

    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;

    const guest = room.users.splice(0,1)[0];
    room.available = true;
    this.agentsConnectionService.updateRoom(room.name, room);

    if(body.requeue) {
      const priorityLine = this.guestsConnectionService.findProperPriorityList(guest);
      this.guestsConnectionService.pushToAssertivePriorityLine(guest, priorityLine.priorityLine);
    }
  }

  @SubscribeMessage('toggle-video-guest')
  async toggleVideoGuest(@MessageBody() toggleVideoGuestData, @ConnectedSocket() socket: Socket) {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    
    room.users.forEach(user => {
      this.server.in(room.name).to(user.socketId).emit('mute-video', {toggleVideo : toggleVideoGuestData});
    })
  }

  @SubscribeMessage('toggle-audio-guest')
  async toggleAudioGuest(@MessageBody() toggleAudioGuestData: any, @ConnectedSocket() socket: Socket) {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    
    room.users.forEach(user => {
      this.server.in(room.name).to(user.socketId).emit('mute-audio', {toggleAudio: toggleAudioGuestData});
    })
  }
}
