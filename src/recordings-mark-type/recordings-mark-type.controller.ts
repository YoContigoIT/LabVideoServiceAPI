import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordingsMarkTypeService } from './recordings-mark-type.service';
import { CreateRecordingsMarkTypeDto } from './dto/create-recordings-mark-type.dto';
import { UpdateRecordingsMarkTypeDto } from './dto/update-recordings-mark-type.dto';

@Controller('recordings-mark-type')
export class RecordingsMarkTypeController {
  constructor(private readonly recordingsMarkTypeService: RecordingsMarkTypeService) {}

  @Post()
  create(@Body() createRecordingsMarkTypeDto: CreateRecordingsMarkTypeDto) {
    return this.recordingsMarkTypeService.create(createRecordingsMarkTypeDto);
  }

  @Get()
  findAll() {
    return this.recordingsMarkTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingsMarkTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordingsMarkTypeDto: UpdateRecordingsMarkTypeDto) {
    return this.recordingsMarkTypeService.update(+id, updateRecordingsMarkTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsMarkTypeService.remove(+id);
  }
}
