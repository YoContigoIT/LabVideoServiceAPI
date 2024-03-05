import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecordingsMarkTypeService } from './recordings-mark-type.service';
import { CreateRecordingsMarkTypeDto } from './dto/create-recordings-mark-type.dto';
import { UpdateRecordingsMarkTypeDto } from './dto/update-recordings-mark-type.dto';
import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { ApiKey, Role } from '../auth/auth.interfaces';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { MultipleAuthorizeGuard } from '../auth/guard/multiple-authorize.guard';

@ApiKeyType(ApiKey.PUBLIC)
@Roles(Role.ADMIN)
@UseGuards(MultipleAuthorizeGuard)
@Controller('recordings-mark-type')
export class RecordingsMarkTypeController {
  constructor(
    private readonly recordingsMarkTypeService: RecordingsMarkTypeService,
  ) {}

  @Post()
  create(@Body() createRecordingsMarkTypeDto: CreateRecordingsMarkTypeDto) {
    return this.recordingsMarkTypeService.create(createRecordingsMarkTypeDto);
  }

  @Get()
  findAll() {
    return this.recordingsMarkTypeService.findAll();
  }

  @Get('cleared')
  async clearedMarks() {
    //Te amo mitch

    const marks = await this.recordingsMarkTypeService.findAll();

    return marks.filter((i) => parseInt(i.id) > 4);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingsMarkTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecordingsMarkTypeDto: UpdateRecordingsMarkTypeDto,
  ) {
    if (+id > 4)
      return this.recordingsMarkTypeService.update(
        id,
        updateRecordingsMarkTypeDto,
      );
    else return HttpStatusResponse.FAIL;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (+id > 4) return this.recordingsMarkTypeService.remove(id);
    else return HttpStatusResponse.FAIL;
  }
}
