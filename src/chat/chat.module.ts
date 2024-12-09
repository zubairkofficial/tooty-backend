import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { BotService } from 'src/bot/bot.service';

@Module({
  providers: [ChatService, JwtService, BotService],
  controllers: [ChatController]
})
export class ChatModule {}
