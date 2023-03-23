import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { Role } from '../auth/auth.interfaces';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove(+id);
  }
}
