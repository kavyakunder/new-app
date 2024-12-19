import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CtClientService } from 'src/ct/ct.service';

@Module({
    controllers: [CustomerController],
    providers: [CustomerService, CtClientService],
    exports: [CustomerService]
})
export class CustomerModule {}
