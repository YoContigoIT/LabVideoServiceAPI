import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { VideoServiceService } from "./video-service.service";
import { Socket, Server } from 'socket.io';
import { RecordingVideoServiceDto } from "./dto/create-video-service.dto";

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
    async startRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {
        const videoRecording = await this.videoServiceService.startRecording(recordingVideoServiceDto);
        console.log('videoRecording-start', videoRecording);
        return videoRecording;
    }

    @SubscribeMessage('stop-recording')
    stopRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {        
        return this.videoServiceService.stopRecording(recordingVideoServiceDto);
    }

    @SubscribeMessage("mark-recording")
    marksRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {
        return this.videoServiceService.marksRecording(recordingVideoServiceDto);
    }
}