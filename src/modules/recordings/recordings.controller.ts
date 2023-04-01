import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { UpdateRecordingDto } from './dto/update-recording.dto';
import { GetRecordingsDto } from './dto/get-recordings.dto';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { ApiKey, Role } from '../auth/auth.interfaces';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { MultipleAuthorizeGuard } from '../auth/guard/multiple-authorize.guard';

@ApiKeyType(ApiKey.PUBLIC)
@Roles(Role.ADMIN)
@UseGuards(MultipleAuthorizeGuard)
@Controller('recordings')
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {}

  @Post()
  create(@Body() createRecordingDto: CreateRecordingDto) {
    return this.recordingsService.create(createRecordingDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() query: GetRecordingsDto) {
    return this.recordingsService.findAll(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/folio/:folio')
  findAllByFolio(@Param('folio') folio: string) {
    return this.recordingsService.findAllByFolio(folio);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsService.remove(id);
  }
}
