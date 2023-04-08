import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { VideoServiceService } from "./video-service.service";
import { Socket, Server } from 'socket.io';
import { RecordingVideoServiceDto } from "./dto/create-video-service.dto";
import { RecordingMarkService } from "src/modules/recording-mark/recording-mark.service";
import { CreateRecordingMarkDto } from "src/modules/recording-mark/dto/create-recording-mark.dto";
import { ApiKeyType } from "src/utilities/decorators/apiKeyType.decorator";
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "../auth/guard/apikey.guard";
import { ApiKey } from "../auth/auth.interfaces";
import { AgentsConnectionService } from '../agents-connection/agents-connection.service';
@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class VideoServiceGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private videoServiceService: VideoServiceService,
        private recordingMarkService: RecordingMarkService,
        @Inject(forwardRef(() => AgentsConnectionService))
        private agentsConnectionService: AgentsConnectionService
    ) {}

    @SubscribeMessage('start-recording')
    async startRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {
        return await this.videoServiceService.startRecording(recordingVideoServiceDto);
    }
    
    @SubscribeMessage('stop-recording')
    stopRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {        
        return this.videoServiceService.stopRecording(recordingVideoServiceDto);
    }
    
    @SubscribeMessage("mark-recording")
    marksRecording(@MessageBody() createRecordingMarkDto: CreateRecordingMarkDto, @ConnectedSocket() client: Socket) {
        
        const room = this.agentsConnectionService.getRoomByHostSocket(client.id);
        if (createRecordingMarkDto.recordingMarkTypeId === '3') {
            // Start recording MARK type
            this.server.in(room.name).emit('recording-status', { isRecording: true});

        } else if (createRecordingMarkDto.recordingMarkTypeId === '4') {
            // Stop recording MARK type
            this.server.in(room.name).emit('recording-status', { isRecording: false });
        }
        
        return this.recordingMarkService.create(createRecordingMarkDto);
    }
}