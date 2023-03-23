import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove(+id);
  }
}