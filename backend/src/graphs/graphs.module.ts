import { Module } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { GraphsController } from './graphs.controller';

@Module({
  controllers: [GraphsController],
  providers: [GraphsService],
  exports: [GraphsService],
})
export class GraphsModule {}
