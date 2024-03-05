import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { Role } from '../auth/auth.interfaces';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Roles(Role.ADMIN)
@UseGuards(AuthJWTGuard, RoleGuard)
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get('public/:clientId')
  findOne(@Param('clientId') clientId: string) {
    return this.apiKeyService.getPublicKey(clientId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.apiKeyService.findAll();
  }

  @Delete(':clientId')
  remove(@Param('clientId') clientId: string) {
    return this.apiKeyService.removeByClientId(clientId);
  }
}
