import { Injectable } from '@nestjs/common';
import { Response } from './interfaces/ct.interface';

@Injectable()
export class AppService {
  healthCheck(): Response {
    return {
      statusCode: 200,
      message: "Everything is working fine..."
    };
  }
}
