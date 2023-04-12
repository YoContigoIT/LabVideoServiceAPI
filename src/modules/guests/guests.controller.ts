import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { GetGuestsDto } from './dto/get-guest.dto';
import { ApiKeyType } from 'src/utilities/decorators/apiKeyType.decorator';
import { ApiKey, Role } from '../auth/auth.interfaces';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { MultipleAuthorizeGuard } from '../auth/guard/multiple-authorize.guard';
import { AwsService } from 'src/services/aws/aws.service';

@ApiKeyType(ApiKey.SECRET)
@Roles(Role.ADMIN)
@UseGuards(MultipleAuthorizeGuard)
@Controller('guests')
export class GuestsController {
  constructor(
    private readonly guestsService: GuestsService,
    private awsService: AwsService,
  ) {}

  @Post()
  create(@Body() createGuestDto: CreateGuestDto): Promise<CreateGuestDto> {
    console.log(createGuestDto);
    
    return this.guestsService.create(createGuestDto);
  }

  @Get()
  async findAll(@Query() query: GetGuestsDto) {
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
