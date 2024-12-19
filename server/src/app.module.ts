import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; 
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';
import { AppService } from './app.service';
import { CtModule } from './ct/ct.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';
import { OrdersModule } from './orders/orders.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';
import { AiService } from './ai/ai.service';
import { AiModule } from './ai/ai.module';
import { AiController } from './ai/ai.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    HttpModule,
    ProductModule,
    CtModule,
    CustomerModule,
    OrdersModule,
    AiModule,
  ],

  controllers: [AppController, CustomerController, ProductController, OrdersController, AiController],
  providers: [AppService, CustomerService, ProductService, OrdersService, AiService],
})
export class AppModule { }
