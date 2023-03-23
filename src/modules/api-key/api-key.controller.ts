import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

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
