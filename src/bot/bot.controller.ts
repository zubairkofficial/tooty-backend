import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto, DeleteBotDto, QueryBot } from './dto/create-bot.dto';
import { CreateBotContextDto } from './dto/create-Join-bot-data.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { GenerateImageDto } from './dto/generateImage.dto';
import { GetBotByLevelDto } from './dto/get-bot-by-level.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('bot')
export class BotController {
    constructor(private readonly botService: BotService) { }

    @Post('generate-image')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async generateImage(@Body() generateImageDto: GenerateImageDto, @Req() req: any) {
        return this.botService.generateImage(generateImageDto, req)
    }

    @Post('query-bot')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async queryBot(@Body() queryBot: QueryBot, @Req() req: any) {
        return this.botService.queryBot(queryBot, req)
    }

    @Post('create-bot')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createBot(@Body() createBotDto: CreateBotDto, @Req() req: any) {

        return this.botService.createBot(createBotDto, req)
    }

    @Post('delete-bot')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteBot(@Body() deleteBotDto: DeleteBotDto, @Req() req: any) {
        return this.botService.deleteBot(deleteBotDto)
    }

    @Post('join-bot-context')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async joinBotContext(@Body() createJoinBot_Context: CreateBotContextDto, @Req() req: any) {
        return this.botService.joinBot_ContextData(createJoinBot_Context)
    }

    @Get('get-all-bots-by-admin')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllBots(@Req() req: any) {
        return this.botService.getAllBotsByAdmin(req)
    }

    @Get('get-bots-by-level')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getBotsByLevel(@Req() req: any) {
        return this.botService.getBotsByLevel(req)
    }
}
