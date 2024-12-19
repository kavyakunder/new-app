import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CtClientService } from 'src/ct/ct.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CtClientService],
  exports: [ProductService]
})
export class ProductModule {}
