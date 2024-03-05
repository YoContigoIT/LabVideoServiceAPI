import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  initialPage(@Res() response: Response, @Req() request: Request) {
    if (request.headers['user-agent'] === 'ELB-HealthChecker/2.0') {
      return response.status(HttpStatus.OK).send('Video Service API OK!');
    }

    return response
      .status(HttpStatus.I_AM_A_TEAPOT)
      .redirect('https://fgebc.gob.mx');
  }

  @Get('hello')
  getHello() {
    return 'Hello World!';
  }
}
