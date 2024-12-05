import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto, DeleteBotDto, QueryBot } from './dto/create-bot.dto';
import { CreateBotContextDto } from './dto/create-Join-bot-data.dto';

@Controller('bot')
export class BotController {
    constructor(private readonly botService: BotService) { }

    @Post('query-bot')
    async queryBot(@Body() queryBot: QueryBot) {
        return this.botService.queryBot(queryBot)
    }

    @Post('create-bot')
    async createBot(@Body() createBotDto: CreateBotDto) {
        return this.botService.createBot(createBotDto)
    }

    @Post('delete-bot')
    async deleteBot(@Body() deleteBotDto: DeleteBotDto) {
        return this.botService.deleteBot(deleteBotDto)
    }

    @Post('join-bot-context')
    async joinBotContext(@Body() createJoinBot_Context: CreateBotContextDto) {
        return this.botService.joinBot_ContextData(createJoinBot_Context)
    }
}
