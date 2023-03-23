import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ClassSerializerInterceptor, UseInterceptors, UseGuards } from '@nestjs/common';
import { CallRecordsService } from './call_records.service';
import { CreateCallRecordDto } from './dto/create-call_record.dto';
import { UpdateCallRecordDto } from './dto/update-call_record.dto';
import { FindAllCallRecordDto } from './dto/find-all-call_record.dto';
import { DashboardGraphCallRecordQueryDto } from './dto/dashboard-graph-call_record.dto';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/auth.interfaces';

@Roles(Role.ADMIN)
@UseGuards(AuthJWTGuard, RoleGuard)
@Controller('call-records')
export class CallRecordsController {
  constructor(private readonly callRecordsService: CallRecordsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query : FindAllCallRecordDto) {
    return this.callRecordsService.findAll(query);
  }

  @Get('/dashboard')
  dashboardGraph(@Query() query : DashboardGraphCallRecordQueryDto) {
    return this.callRecordsService.dashboardGraph(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callRecordsService.findOne(+id);
  }
}
