import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';
import { AgentsConnectionService } from "./agents-connection.service";
import { CreateAgentsConnectionDto } from "./dto/create-agents-connection.dto";
import { HttpResponse } from "src/common/interfaces/http-responses.interface";
import { Guest } from "src/modules/guests-connection/guests-connection.interface";
import { Room } from "./agents-connection.interface";
import { getUuidv4 } from "src/utilities/helpers";
import { VideoServiceService } from "src/modules/video-service/video-service.service";
import { CreateVideoServiceDto } from "src/modules/video-service/dto/create-video-service.dto";
import { CallRecordsService } from "src/modules/call_records/call_records.service";
import { RecordingsService } from "src/modules/recordings/recordings.service";
import { RecordingMarkService } from "src/modules/recording-mark/recording-mark.service";
import { AgentService } from "../agent/agent.service";
import { CallRecord } from "../call_records/entities/call_record.entity";
import { GuestsConnectionService } from "../guests-connection/guests-connection.service";
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { ApiKeyType } from "src/utilities/decorators/apiKeyType.decorator";
import { ApiKeyGuard } from "../auth/guard/apikey.guard";
import { ApiKey } from "../auth/auth.interfaces";
import { RefuseCallDto } from "./dto/refuse-call.dto";
import { GuestsConnectionGateway } from "../guests-connection/guests-connection.gateway";

@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
@WebSocketGateway({
  namespace: "/agent",
  cors: {
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  },
})
export class AgentsConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => GuestsConnectionService)) private guestsConnectionService: GuestsConnectionService,
    @Inject(forwardRef(() => GuestsConnectionGateway)) private guestsConnectionGateway: GuestsConnectionGateway,
    private agentsConnectionService: AgentsConnectionService,
    private videoServiceService: VideoServiceService,
    private callRecordService: CallRecordsService,
    private recordingService: RecordingsService,
    private recordingMarkService: RecordingMarkService,
    private agentsService: AgentService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('------------------connect_agent------------------');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<HttpResponse> {
    console.log('---------disconnect_agent---------');

    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    console.log(room, 'room-disconnect');
    
    if (!room) return;

    // TODO: SessionId es de OPENVIDU 
    if (room.sessionId){
      try {
        
        const OVSession = await this.videoServiceService.getSessionById(room.sessionId);
        
        room?.users.forEach(async user => {
          this.guestsConnectionService.updateGuestConnection(user.guestConnectionId, {
            endTimeConnection: new Date()
          });
          const callRecordId = await this.callRecordService.findCallRecordByGuestConnectionId(room.users[0].guestConnectionId);
          if(callRecordId) this.callRecordService.update(callRecordId.id);
          
          this.guestsConnectionGateway.server.to(user.socketId).emit('agent-disconnected', {});
        })

        await OVSession.fetch()
        if(OVSession?.connections?.length) await OVSession.close().catch((e) => {
          console.warn("----ERROR WITH OPENVIDU WHEN CLOSSING----", e);
        });
      } catch (e) {
        console.log(e);
      }
      
    } else if (room.users.length) {
      console.log('requeue');      
      this.queueGuestReconnect({ requeue: true }, socket)
    }
    
    this.agentsConnectionService.removeRoom(room.name);

    await this.agentsConnectionService.saveAgentDisconnection(room.host.agentConnectionId);

  }
  
  @SubscribeMessage('connect-agent')
  async connectAgent(@MessageBody() createAgentsConnectionDto: CreateAgentsConnectionDto, @ConnectedSocket() client: Socket) {
    createAgentsConnectionDto.ip = client.handshake.headers['x-forwarded-for'] as string || client.handshake.address;

    const agent = await this.agentsService.findOne(createAgentsConnectionDto.agent as any);
    if (!agent) throw new WsException('There is not any Agent with this UUID');
    // console.log(agent.uuid, '<--------------------agent');
    
    //TODO: si hay un room con el uuid del agente es que ya esta conectado
    const room = this.agentsConnectionService.getRoomByAgentUUID(createAgentsConnectionDto.agent as any);
    if (room){
      console.log(room, 'room-exception- ¿Why exist?'); 
      throw new WsException({ message: 'The Agent is already connect', error: 'ALREADY_CONNECTED' });
    }

    const agentConnection = await this.agentsConnectionService.agentConnection(createAgentsConnectionDto);

    const roomName = await getUuidv4();
    
    this.server.in(client.id).socketsJoin(roomName);

    this.agentsConnectionService.addUserToRoom(roomName, {
      uuid: agent.uuid,
      socketId: client.id,
      agentConnectionId: agentConnection.id,
      agent
    });

    console.log(this.agentsConnectionService.rooms, '---------rooms--------');
    return { agentConnection, agent };
  }

  guestInRoom(room: Room, guest: Guest) {
    this.server.in(guest.socketId).socketsJoin(room.name);
    this.guestsConnectionGateway.server.in(guest.socketId).emit('guest-connected', true);

    this.server.in(room.host.socketId).emit('guest-connected', guest);
  }

  @SubscribeMessage('connect-call')
  async connectCall(@MessageBody() createVideoServiceDto: CreateVideoServiceDto, @ConnectedSocket() client: Socket) {
    const session = await this.videoServiceService.createSession(createVideoServiceDto);
    
    const connection = await this.videoServiceService.createConnection(session, {});

    const room = this.agentsConnectionService.getRoomByHostSocket(client.id);
    if(!room) throw new WsException('No hay denunciantes activos en tu sala');

    if (room?.users?.length) {
      await this.guestsConnectionService.updateGuestConnection(room.users[0].guestConnectionId, {
        answer: new Date()
      });
    }
    
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

    room.users?.forEach(async user => {
        const connection = await this.videoServiceService.createConnection(session, {});
        
        this.guestsConnectionGateway.server.to(user.socketId).emit('video-ready', {
          token: connection.token,
          connectionId: connection.connectionId,
          sessionId: session.sessionId,
          agent: {
            name: room.host.agent.fullName,
            role: room.host.agent.role.title
          }
        });

        this.guestsConnectionService.updateGuestConnection(user.guestConnectionId, { sessionId: session.sessionId });
      }
    );

    this.agentsConnectionService.updateSessionIdOnRoom(session.sessionId, room.name);

    return {
      sessionId: session.sessionId,
      token: connection.token,
      connectionId: connection.connectionId,
      recordingId: recordingInfo.id,
    }
  }

  @SubscribeMessage('refuse-call')
  queueGuestReconnect(@MessageBody() refuseCallDto: RefuseCallDto, @ConnectedSocket() socket: Socket) {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    if (!room) return;

    const guest = room.users.splice(0,1)[0];
    room.available = true;
    this.agentsConnectionService.updateRoom(room.name, room);
    
    if(refuseCallDto.requeue) {
      const priorityLine = this.guestsConnectionService.findProperPriorityList(guest);

      this.guestsConnectionService.pushToAssertivePriorityLine(guest, priorityLine.priorityLine);
    } else {
      this.guestsConnectionGateway.server.to(guest.socketId).emit('disconnect-guest', { reason: 'CALL_REFUSED'});
    }

    return { success: true };
  }

  @SubscribeMessage('toggle-video-guest')
  async toggleVideoGuest(@MessageBody() toggleVideoGuestData, @ConnectedSocket() socket: Socket) {
    console.log('toggleVideoGuestData', toggleVideoGuestData);
    
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    
    room.users.forEach(user => {
      this.guestsConnectionGateway.server.in(room.name).to(user.socketId).emit('mute-video', {toggleVideo : toggleVideoGuestData});
    })

    return toggleVideoGuestData;
  }

  @SubscribeMessage('toggle-audio-guest')
  async toggleAudioGuest(@MessageBody() toggleAudioGuestData: any, @ConnectedSocket() socket: Socket) {
    console.log('toggleAudioGuestData', toggleAudioGuestData);
    
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
    
    room.users.forEach(user => {
      this.guestsConnectionGateway.server.in(room.name).to(user.socketId).emit('mute-audio', {toggleAudio: toggleAudioGuestData});
    })

    return toggleAudioGuestData;
  }

  @SubscribeMessage('refresh-guest-connection')
  refreshGuestConnection(@ConnectedSocket() socket: Socket) {
    const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);

    if (room?.users) {
      room.users.forEach(user => {
        this.guestsConnectionGateway.server.in(room.name).to(user.socketId).emit('refresh-connection');
      });
    }

    return;
  }

  @SubscribeMessage('reload-agent-video-call')
  async reloadAgentVideoCall(@ConnectedSocket() socket: Socket) {
    try {
      const room = this.agentsConnectionService.getRoomByHostSocket(socket.id);
      if(!room) return;
  
      const sessionId = await this.videoServiceService.getSessionById(room.sessionId);
      if(!sessionId) return;
  
      const connection = await this.videoServiceService.createConnection(sessionId, {});
      
      return connection 
    } catch (e) {
      console.warn(e)
    }
  }

  @SubscribeMessage('close-video-call')
  async closeVideoCall(@ConnectedSocket() client: Socket) {
    console.log("ENTRANDO A close-video-call")

    const room = this.agentsConnectionService.getRoomByHostSocket(client.id);

    if (!room) return room;

    if(room.users?.length) {
      this.guestsConnectionService.updateGuestConnection(room.users[0].guestConnectionId, {
        endTimeConnection: new Date()
      });
      const callRecordId = await this.callRecordService.findCallRecordByGuestConnectionId(room.users[0].guestConnectionId);
      if(callRecordId) this.callRecordService.update(callRecordId.id);
    }


    if (room?.sessionId){
      try {
        const OVSession = await this.videoServiceService.getSessionById(room.sessionId);
        console.log(OVSession, 'OV');
        await OVSession.fetch()
        if(OVSession?.connections?.length) await OVSession.close().catch((e) => {
          console.warn("----ERROR WITH OPENVIDU WHEN CLOSSING----", e);
        });

      } catch (e) {
        console.warn('-----ERROR OPENVIDU ON close-video-call------', e);
      }
      
    }
    
    this.agentsConnectionService.removeRoom(room.name);

    console.log('ROOM USERS ---->', room.users);
    
    room.users?.forEach(user => {
      this.guestsConnectionGateway.server.in(room.name).to(user.socketId).emit('disconnect-guest', 'disconnect from server');
    })

    room.available = true;

    client.disconnect(true);

    // room.users = [];
    // room.sessionId = undefined;
    // room.available = true;
    // this.agentsConnectionService.updateRoom(room.name, room);
    // return room;
  }

}
