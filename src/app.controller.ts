import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  initialPage(@Res() response: Response) {
    return response.status(HttpStatus.I_AM_A_TEAPOT).redirect("https://fgebc.gob.mx");
  }
}
