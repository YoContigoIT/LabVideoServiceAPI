import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { VideoServiceService } from "./video-service.service";
import { Socket, Server } from 'socket.io';
import { startRecordingVideoServiceDto } from "./dto/create-video-service.dto";

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
    ) {}

    @SubscribeMessage('start-recording')
    async startRecording(@MessageBody() startRecordingVideoServiceDto: startRecordingVideoServiceDto, @ConnectedSocket() client: Socket) {
        console.log('body');
        
        console.log({ client: client.id, data: startRecordingVideoServiceDto });
        
        return this.videoServiceService.startRecording(startRecordingVideoServiceDto.sessionId);
    }
}