import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';

@Controller('users')
// @UseGuards(AuthJWTGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Authorization(['ADMIN'])
  async create(@Body() createUserDto: CreateUserDto): Promise<HttpResponse> {
    const user = await this.usersService.create(createUserDto).catch(e => e);

    if (user?.uuid) {
      return {
        status : HttpStatusResponse.SUCCESS
      }
    }

    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
