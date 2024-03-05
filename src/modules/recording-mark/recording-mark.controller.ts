import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecordingMarkService } from './recording-mark.service';
import { CreateRecordingMarkDto } from './dto/create-recording-mark.dto';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/auth.interfaces';

@Roles(Role.ADMIN)
@UseGuards(AuthJWTGuard, RoleGuard)
@Controller('recording-mark')
export class RecordingMarkController {
  constructor(private readonly recordingMarkService: RecordingMarkService) {}

  @Post()
  create(@Body() createRecordingMarkDto: CreateRecordingMarkDto) {
    return this.recordingMarkService.create(createRecordingMarkDto);
  }
}
