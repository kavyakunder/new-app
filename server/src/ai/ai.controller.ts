import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { DataDto } from 'src/interfaces/data.dto';
import { Response } from 'src/interfaces/ct.interface';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }
    @Post('')
    @HttpCode(200)
    async getProducts(@Body() body: DataDto): Promise<Response> {
        const { query } = body;
        return await this.aiService.getProductDetails(query);
    }
}
