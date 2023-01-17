import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CallRecordsService } from './call_records.service';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { UpdateCallRecordDto } from './dto/update-call_record.dto';

@Controller('call-records')
export class CallRecordsController {
  constructor(private readonly callRecordsService: CallRecordsService) {}

  @Post()
  create(@Body() createCallRecordDto: CreateCallRecordDto) {
    return this.callRecordsService.create(createCallRecordDto);
  }

  @Get()
  findAll() {
    return this.callRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallRecordDto: UpdateCallRecordDto) {
    return this.callRecordsService.update(+id, updateCallRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callRecordsService.remove(+id);
  }
}
