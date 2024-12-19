import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ProductService } from '../product/product.service';
import { CtClientService } from 'src/ct/ct.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  providers: [OrdersService, ProductService, CtClientService, CustomerService],
  exports: [OrdersService], // Export OrdersService if needed in other modules
})
export class OrdersModule { }