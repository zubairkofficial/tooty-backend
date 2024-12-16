import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from './entities/bot.entity';
import { ConfigModule } from '@nestjs/config';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { ApiService } from 'src/api/api.service';

@Module({
    imports: [SequelizeModule.forFeature([Bot]), ConfigModule],
    controllers: [BotController],
    providers: [BotService, JwtService, ChatService, ApiService],
})
export class BotModule { }
