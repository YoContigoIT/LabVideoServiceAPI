import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Request, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Controller('users')
// @UseGuards(AuthJWTGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Authorization(['ADMIN'])
  async create(@Body() createUserDto: CreateUserDto): Promise<HttpResponse> {
    const user = await this.usersService.create(createUserDto);

    if (user?.uuid) {
      return {
        uuid: user.uuid,
        status : HttpStatusResponse.SUCCESS
      }
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(uuid, updateUserDto);
  }

  @Patch('/password/:uuid')
  async updatePassword(@Param('uuid') uuid: string, @Body() updatePasswordUserDto: UpdatePasswordUserDto) {
    return this.usersService.updatePassword(uuid, updatePasswordUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.usersService.remove(uuid);
  }
}
