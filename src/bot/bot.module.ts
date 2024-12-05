import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from './entities/bot.entity';
import { ConfigModule } from '@nestjs/config';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [SequelizeModule.forFeature([Bot]), ConfigModule],
    controllers: [BotController],
    providers: [BotService, JwtService],
})
export class BotModule { }
