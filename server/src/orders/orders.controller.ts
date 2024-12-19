import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { OrdersService } from './orders.service'; 
import { Response } from 'src/interfaces/ct.interface';
import { AddDataDto } from 'src/interfaces/data.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('')
    @HttpCode(200)
    async getAllOrderDetails(): Promise<Response> {
        return await this.ordersService.getAllOrderDetails();
    }
    @Delete('')
    @HttpCode(200)
    async deleteAllOrderDetails(): Promise<Response> {
        return await this.ordersService.deleteAllOrderDetails();
    }
    @Post('')
    @HttpCode(200)
    async orderDetails(@Body() body: AddDataDto): Promise<Response> {
        const { offset } = body;
        return await this.ordersService.orderDetails(offset);
    }
}
