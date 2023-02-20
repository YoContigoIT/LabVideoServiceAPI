import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { VideoServiceService } from "./video-service.service";
import { Socket, Server } from 'socket.io';
import { RecordingVideoServiceDto } from "./dto/create-video-service.dto";
import { RecordingMarkService } from "src/modules/recording-mark/recording-mark.service";
import { CreateRecordingMarkDto } from "src/modules/recording-mark/dto/create-recording-mark.dto";

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
    ) {}

    @SubscribeMessage('start-recording')
    async startRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {
        const videoRecording = await this.videoServiceService.startRecording(recordingVideoServiceDto);
        return videoRecording;
    }

    @SubscribeMessage('stop-recording')
    stopRecording(@MessageBody() recordingVideoServiceDto: RecordingVideoServiceDto, @ConnectedSocket() client: Socket) {        
        return this.videoServiceService.stopRecording(recordingVideoServiceDto);
    }

    @SubscribeMessage("mark-recording")
    marksRecording(@MessageBody() createRecordingMarkDto: CreateRecordingMarkDto) {
        return this.recordingMarkService.create(createRecordingMarkDto);
    }
}