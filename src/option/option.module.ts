import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';

@Module({
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
