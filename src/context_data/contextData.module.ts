import { Module } from '@nestjs/common';
import { ContextDataController } from './contextData.controller';
import { ContextDataService } from './contextData.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContextData } from './entities/contextData.entity';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    SequelizeModule.forFeature([ContextData]), ConfigModule],
  controllers: [ContextDataController],
  providers: [ContextDataService]
})
export class ContextDataModule { }
