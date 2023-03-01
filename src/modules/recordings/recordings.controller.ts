import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { UpdateRecordingDto } from './dto/update-recording.dto';
import { GetRecordingsDto } from './dto/get-recordings.dto';

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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordingDto: UpdateRecordingDto) {
    return this.recordingsService.update(+id, updateRecordingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsService.remove(+id);
  }
}
