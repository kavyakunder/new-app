import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './interfaces/ct.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  healthCheck(): Response {
    return this.appService.healthCheck();
  }
}
