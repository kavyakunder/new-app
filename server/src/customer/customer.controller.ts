import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'src/interfaces/ct.interface';
import { AddDataDto } from '../interfaces/data.dto';
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }
    @Get('')
    @HttpCode(200)
    async getAllCustomersDetails(): Promise<Response> {
        return await this.customerService.getAllCustomersDetails();
    }
    @Delete('')
    @HttpCode(200)
    async deleteAllCustomersDetails(): Promise<Response> {
        return await this.customerService.deleteAllCustomersDetails();
    }
    @Post('')
    @HttpCode(200)
    async customerDetails(@Body() body: AddDataDto): Promise<Response> {
        const { offset } = body;
        return await this.customerService.customerDetails(offset);
    }
}
