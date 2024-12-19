import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'src/interfaces/ct.interface';
import { AddDataDto } from '../interfaces/data.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get('')
    @HttpCode(200)
    async getAllProductDetails(): Promise<Response> {
        return await this.productService.getAllProductDetails();
    }
    @Delete('')
    @HttpCode(200)
    async deleteAllProducts(): Promise<Response>{
        return await this.productService.deleteAllProducts();
    }
    @Post('')
    @HttpCode(201)
    async productDetails(@Body() body: AddDataDto): Promise<Response> {
        const { offset } = body;
        return await this.productService.productDetails(offset);
    }

}
