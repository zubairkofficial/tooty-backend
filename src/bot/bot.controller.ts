import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto, DeleteBotDto, QueryBot } from './dto/create-bot.dto';
import { CreateBotContextDto } from './dto/create-Join-bot-data.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';

@Controller('bot')
export class BotController {
    constructor(private readonly botService: BotService) { }

    @Post('query-bot')
    @UseGuards(JwtAuthGuard)
    async queryBot(@Body() queryBot: QueryBot, @Req() req: any) {
        return this.botService.queryBot(queryBot, req)
    }

    @Post('create-bot')
    @UseGuards(JwtAuthGuard)
    async createBot(@Body() createBotDto: CreateBotDto, @Req() req: any) {
        console.log(createBotDto)
        return this.botService.createBot(createBotDto, req)
    }

    @Post('delete-bot')
    @UseGuards(JwtAuthGuard)
    async deleteBot(@Body() deleteBotDto: DeleteBotDto, @Req() req: any) {
        return this.botService.deleteBot(deleteBotDto)
    }

    @Post('join-bot-context')
    @UseGuards(JwtAuthGuard)
    async joinBotContext(@Body() createJoinBot_Context: CreateBotContextDto, @Req() req: any) {
        return this.botService.joinBot_ContextData(createJoinBot_Context)
    }

    @Get('get-all-bots-by-admin')
    // @UseGuards(JwtAuthGuard)
    async getAllBots(@Req() req: any) {
        return this.botService.getAllBotsByAdmin(req)
    }
}
