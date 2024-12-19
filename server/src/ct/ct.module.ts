import { Module } from '@nestjs/common';
import { CtClientService } from './ct.service';

@Module({
    providers: [CtClientService],
    exports: [CtClientService]
})
export class CtModule {}
