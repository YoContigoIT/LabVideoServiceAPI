import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  create(@Body() createGuestDto: CreateGuestDto): Promise<CreateGuestDto> {
    return this.guestsService.create(createGuestDto);
  }

  @Get()
  findAll(): Promise<Guest[]> {
    return this.guestsService.findAll();
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
