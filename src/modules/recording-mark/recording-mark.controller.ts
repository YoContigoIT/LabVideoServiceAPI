import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordingMarkService } from './recording-mark.service';
import { CreateRecordingMarkDto } from './dto/create-recording-mark.dto';
import { UpdateRecordingMarkDto } from './dto/update-recording-mark.dto';

@Controller('recording-mark')
export class RecordingMarkController {
  constructor(private readonly recordingMarkService: RecordingMarkService) {}

  @Post()
  create(@Body() createRecordingMarkDto: CreateRecordingMarkDto) {
    return this.recordingMarkService.create(createRecordingMarkDto);
  }

  @Get()
  findAll() {
    return this.recordingMarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingMarkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordingMarkDto: UpdateRecordingMarkDto) {
    return this.recordingMarkService.update(+id, updateRecordingMarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingMarkService.remove(+id);
  }
}
