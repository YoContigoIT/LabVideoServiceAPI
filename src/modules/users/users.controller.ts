import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Request, UseGuards, ClassSerializerInterceptor, UseInterceptors, Query, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { AuthJWTGuard } from 'src/modules/auth/guard/auth.guard';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { Roles } from 'src/utilities/decorators/roles.decorator';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/auth.interfaces';

@Roles(Role.ADMIN)
@UseGuards(AuthJWTGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  findAll(@Query() query: GetUsersDto) {  
    return this.usersService.findAll(query);
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
