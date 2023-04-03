import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { CreateVideoServiceDto } from './dto/create-video-service.dto';
import { UpdateVideoServiceDto } from './dto/update-video-service.dto';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { Role } from '../auth/auth.interfaces';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';

@Roles(Role.ADMIN)
@UseGuards(AuthJWTGuard, RoleGuard)
@Controller('videoservice')
export class VideoServiceController {
  constructor(private readonly videoServiceService: VideoServiceService) {}

  @Post()
  async createSession(@Body() createVideoServiceDto: CreateVideoServiceDto): Promise<any> {
    const session = await this.videoServiceService.createSession(createVideoServiceDto);
    const connection = await this.videoServiceService.createConnection(session, {});

    return {
      sessionId: session.sessionId,
      token: connection.token,
      connectionId: connection.connectionId,
      session,
      connection,
    }
  }
}
