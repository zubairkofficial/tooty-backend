import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';

import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { FetchChatDto, FetchChatHistoryDto } from './dto/fetch-chat.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';


@Controller('chat')
export class ChatController {
    constructor(private readonly chatSerivce: ChatService) { }



    @Post('/fetch-chat-history')
    @Roles(Role.TEACHER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)

    fetchChatHistory(@Body() fetchChatHistoryDto: FetchChatHistoryDto, @Req() req: any) {
        return this.chatSerivce.fetchChatHistory(fetchChatHistoryDto, req)
    }

    //fetch chats against bot_id and user_id
    @Post('/fetch-chat')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)

    fetchChat(@Body() fetchChatDto: FetchChatDto, @Req() req: any) {
        return this.chatSerivce.fetchChat(fetchChatDto, req)
    }

    // it will create message and reply against a session
    @Post('/create-message')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    sendMessage(@Body() createChatDto: CreateChatDto, @Req() req: any) {
        return this.chatSerivce.sendMessage(createChatDto, req);
    }
}
