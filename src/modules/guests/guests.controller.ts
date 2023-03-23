import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { GetGuestsDto } from './dto/get-guest.dto';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { ApiKey } from '../auth/auth.interfaces';

@ApiKeyType(ApiKey.PUBLIC)
@UseGuards(ApiKeyGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  create(@Body() createGuestDto: CreateGuestDto): Promise<CreateGuestDto> {
    return this.guestsService.create(createGuestDto);
  }

  @Get()
  findAll(@Query() query: GetGuestsDto) {
    return this.guestsService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<Guest> {
    return this.guestsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.updateGuest(uuid, updateGuestDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.guestsService.removeGuest(uuid);
  }
}
