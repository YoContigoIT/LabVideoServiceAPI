import { Controller, Post, Body } from '@nestjs/common';
import { LoginResponse, LoginStatus } from './auth.interfaces';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() createAuthDto: CreateAuthDto): Promise<LoginResponse> {
    const userInfo = await this.authService.checkUserExists(
      createAuthDto.email,
    );

    if (!userInfo) {
      return {
        status: LoginStatus.INVALID_CREDENTIALS,
      };
    }

    const isMatch = await bcrypt.compare(
      createAuthDto.password,
      userInfo.password,
    );

    if (!isMatch) {
      return {
        status: LoginStatus.INVALID_CREDENTIALS,
      };
    }

    const payload = {
      displayname: userInfo.names + ' ' + userInfo.lastnames,
      email: userInfo.email,
      uuid: userInfo.uuid,
      role: userInfo.roleId?.title,
    };
    const jwt = this.jwtService.sign(payload);

    return {
      status: LoginStatus.SUCCESS,
      token: jwt,
    };
  }
}
