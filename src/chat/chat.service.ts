
import { Op } from 'sequelize';

import { CreateChatDto } from './dto/create-chat.dto';

import { Chat } from './entities/chat.entity';

import { BotService } from 'src/bot/bot.service';

import { QueryBot } from 'src/bot/dto/create-bot.dto';
import { FetchChatDto } from './dto/fetch-chat.dto';

export class ChatService {
    constructor(
        private botService: BotService
    ) { }


    async fetchChat(fetchChatDto: FetchChatDto, req: any) {
        try {

            const data = await Chat.findAll({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    },
                    bot_id: {
                        [Op.eq]: fetchChatDto.bot_id
                    }
                }
            })

            return {
                statusCode: 200,
                data: data
            }
        } catch (error) {
            throw new Error("error fetching chats")
        }
    }

    async sendMessage(createChatDto: CreateChatDto, req: any) {
        console.log("creating message body", createChatDto)
        try {
            const chat = await Chat.create({
                bot_id: createChatDto.bot_id,
                message: createChatDto.message,
                is_bot: createChatDto.is_bot,
                user_id: req.user.sub
            });

            // if (!chat.is_bot) {
            //     const queryBot: QueryBot = { query: chat.message, bot_id: createChatDto.bot_id }
            //     console.log("query bot in message service", queryBot)
            //     const message_reply = await this.botService.queryBot(queryBot)

            //     if (message_reply.statusCode == 200) {
            //         return {
            //             statusCode: 200,
            //             message: "user message created and answer returned",
            //             answer: message_reply.answer
            //         }
            //     } else {
            //         throw new Error("Error querying query from user")
            //     }
            // }

            return {
                statusCode: 200,
                message: "message by user created successfully"
            }

        } catch (error) {
            console.log(error)
            throw new Error('error creating message')
        }


    }
}
