import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  initialPage(@Res() response: Response, @Req() request: Request) {
    console.log(request.headers['user-agent']);
    if(request.headers['user-agent'] === "ELB-HealthChecker/") {
      return response.status(HttpStatus.OK).send('Video Service API OK!');
    }
    
    return response.status(HttpStatus.I_AM_A_TEAPOT).redirect("https://fgebc.gob.mx");
  }
}
