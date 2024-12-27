import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto, DeleteBotDto, GetBotByLevelSubject, GetBotBySubjectDto, GetBotDto, QueryBot, UpdateBotDto } from './dto/create-bot.dto';
import { CreateBotContextDto, DeleteBotContextDto, GetBotContextDto, UpdateBotContextDto } from './dto/create-Join-bot-data.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { GenerateImageDto } from './dto/generateImage.dto';
import { GetBotByLevelDto } from './dto/get-bot-by-level.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorageConfig } from 'src/config/multer.config';

@Controller('bot')
export class BotController {
    constructor(private readonly botService: BotService) { }

    @Post('generate-image')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async generateImage(@Body() generateImageDto: GenerateImageDto, @Req() req: any) {
        return this.botService.generateImage(generateImageDto, req)
    }

    @Post('query-bot')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)

    async queryBot(@Body() queryBot: QueryBot, @Req() req: any) {

        return this.botService.queryBot(queryBot, req)
    }

    @Post('create-bot')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(
        FileInterceptor('image', multerStorageConfig)
    )
    async createBot(@UploadedFile() image: Express.Multer.File, @Body() createBotDto: CreateBotDto, @Req() req: any) {
        if (!image) {
            return {
                message: "No image uploaded"
            }
        }
        console.log(createBotDto)
        return this.botService.createBot(image, createBotDto, req)
    }


    @Post('update-bot')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateBot(@Body() updateBotDto: UpdateBotDto, @Req() req: any) {

        return this.botService.updateBot(updateBotDto, req)
    }
    @Post('delete-bot')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteBot(@Body() deleteBotDto: DeleteBotDto, @Req() req: any) {
        return this.botService.deleteBot(deleteBotDto)
    }


    @Post('create-join-bot-context')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createJoinBotContext(@Body() createBotContextDto: CreateBotContextDto, @Req() req: any) {
        return this.botService.createJoinBot_ContextData(createBotContextDto)
    }

    @Post('delete-join-bot-context')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteJoinBotContext(@Body() deleteBotContextDto: DeleteBotContextDto, @Req() req: any) {
        return this.botService.deleteJoinBot_ContextData(deleteBotContextDto)
    }


    @Post('update-join-bot-context')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateJoinBotContext(@Body() updateJoinBot_Context: UpdateBotContextDto, @Req() req: any) {
        return this.botService.updateJoinBot_ContextData(updateJoinBot_Context)
    }


    @Post('get-join-bot-context')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getJoinBotContext(@Body() getBotContextDto: GetBotContextDto, @Req() req: any) {
        return this.botService.getBotContextDto(getBotContextDto)
    }



    @Post('get-bot')
    @UseGuards(JwtAuthGuard)
    async getBot(@Body() getBotDto: GetBotDto, @Req() req: any) {
        return this.botService.getBot(getBotDto)
    }

    @Post('get-bot-by-subject')
    @Roles(Role.TEACHER)
    @UseGuards(JwtAuthGuard)
    async getBotBySubject(@Body() getBotDto: GetBotBySubjectDto, @Req() req: any) {
        return this.botService.getBotBySubject(getBotDto, req)
    }

    @Post('get-bot-by-level-subject')
    @Roles(Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getBotByLevelSubject(@Body() getBotByLevelSubject: GetBotByLevelSubject, @Req() req: any) {
        return this.botService.getBotByLevelSubject(getBotByLevelSubject)
    }


    @Get('get-all-bots-by-teacher')
    @Roles(Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getBotsByTeacher(@Req() req: any) {
        return this.botService.getAllBotsByTeacher(req)
    }

    @Get('get-all-bots-by-admin')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllBotsByAdmin(@Req() req: any) {
        return this.botService.getAllBotsByAdmin(req)
    }

    @Get('get-bots-by-level')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getBotsByLevel(@Req() req: any) {
        return this.botService.getBotsByLevel(req)
    }
}
