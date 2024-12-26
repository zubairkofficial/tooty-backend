import { Logger } from "@nestjs/common";
import { CreateBotDto, DeleteBotDto, GetBotByLevelSubject, GetBotDto, QueryBot, UpdateBotDto } from "./dto/create-bot.dto";
import { Bot } from "./entities/bot.entity";
import { CreateBotContextDto, DeleteBotContextDto, GetBotContextDto, UpdateBotContextDto } from "./dto/create-Join-bot-data.dto";
import { Join_BotContextData } from "./entities/join_botContextData.entity";
import { ContextData } from "src/context_data/entities/contextData.entity";
import { OpenAIEmbeddings, OpenAI, DallEAPIWrapper } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Request } from "express";
import sequelize from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Chat } from "src/chat/entities/chat.entity";
import { GenerateImageDto } from "./dto/generateImage.dto";
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'
import { ChatService } from "src/chat/chat.service";
import { Op } from "sequelize";
import { GetBotByLevelDto } from "./dto/get-bot-by-level.dto";
import { API } from "src/api/entities/api.entity";
import { ApiService } from "src/api/api.service";
import { Level } from "src/level/entity/level.entity";
import { JoinTeacherSubjectLevel } from "src/profile/entities/join-teacher-subject-level.entity";
import { TeacherProfile } from "src/profile/entities/teacher-profile.entity";
import { AdminProfile } from "src/profile/entities/admin-profile.entity";

export class BotService {

    constructor(
        private readonly logger = new Logger('BotService'),
        private readonly sequelize: Sequelize,
        private readonly chatService: ChatService,
        private readonly apiServices: ApiService
    ) { }

    async generateImage(generateImageDto: GenerateImageDto, req: any) {
        console.log("data from message", generateImageDto)
        let api_key = ""
        try {
            const bot = await Bot.findByPk(generateImageDto.bot_id)
            console.log("bot in bot", bot)

            if (!bot) {
                throw new Error("No bot with this id exist")
            }


            const api = await AdminProfile.findOne({
                attributes: ["dalle"]
            })




            if (!api) {
                throw new Error("unable to find api key")
            }

            api_key = api?.dalle

            if (api_key != "") {
                console.log(generateImageDto.answer)
                const tool = new DallEAPIWrapper({
                    n: 1, // Default
                    model: "dall-e-3", // Default
                    apiKey: api_key, // Default
                });

                const imageURL = await tool.invoke(generateImageDto.answer);
                console.log(imageURL)
                const imageSaveResult = await this.downloadImage(imageURL, req, generateImageDto.chat_id)
                console.log("image save url", imageSaveResult)
                if (imageSaveResult == "") {
                    throw new Error("error creating image chat")
                }
                const chat = await Chat.create({
                    is_bot: true,
                    bot_id: generateImageDto.bot_id,
                    message: "",
                    image_url: imageSaveResult,
                    user_id: req.user.sub
                })
                console.log(imageURL)
                return {
                    statusCode: 200,
                    data: chat
                }
            }
        } catch (error) {
            console.log("an error occured while generating image", error)
            throw new Error("an error occured while generating image")
        }
    }

    async downloadImage(imageUrl: string, req: any, chat_id: number): Promise<string> {
        try {
            console.log("came here 1")
            // Define the save path
            const savePath = path.join(__dirname, '..', '..', 'images');

            console.log("came here 2", savePath)
            // Ensure the chatImages directory exists
            if (!fs.existsSync(savePath)) {
                console.log("came here n")
                fs.mkdirSync(savePath, { recursive: true });
            }

            // Extract the file name from the URL and set the file path
            const fileName = req.user.sub + "-" + chat_id + "-" + Math.random() * 10000 + ".png"

            const filePath = path.join(savePath, fileName);
            console.log(`
                {
                fileName: ${fileName},
                filePath: ${filePath}
                }
                `)
            // Create a writable stream
            const writer = fs.createWriteStream(filePath);

            // Fetch the image
            const response = await axios({
                url: imageUrl,
                method: 'GET',
                responseType: 'stream',
            });

            // Pipe the response data to the writable stream
            response.data.pipe(writer);

            // Return a promise that resolves when the file is written
            const promise = new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(`Image saved at ${filePath}`));
                writer.on('error', reject);
            });
            const result = promise.then((message) => {
                console.log(message)
                return fileName
            })
                .catch((error) => {
                    console.log(error)
                    return ""
                })
            return result
        } catch (error) {
            console.log("an error ocured in download image fnc", error)
            return ""
        }
    }


    async queryBot(queryBot: QueryBot, req: any) {
        console.log("data from message", queryBot)
        let api_key = ""
        try {
            const bot = await Bot.findByPk(queryBot.bot_id)
            console.log("bot in bot", bot)

            if (!bot) {
                throw new Error("No bot with this id exist")
            }

            const bot_files = await Join_BotContextData.findAll({
                attributes: ["file_id"],
                where: {
                    bot_id: {
                        [Op.eq]: bot.id
                    }
                }
            })

            if (bot_files.length == 0) {
                throw new Error("no files are attached")
            }

            const api = await AdminProfile.findOne({
                attributes: ["openai"]

            })



            if (!api) {
                throw new Error("unable to find api key")
            }

            api_key = api?.openai

            if (api_key != "") {


                const chatContext = await Chat.findAll({
                    attributes: {
                        include: ["message", "is_bot"]
                    },
                    where: {
                        bot_id: {
                            [Op.eq]: queryBot.bot_id
                        },
                        user_id: {
                            [Op.eq]: req.user?.sub
                        },
                    },
                    limit: Number(process?.env?.CONTEXT_MESSAGES_LIMIT) || 5,
                    order: [['createdAt', 'DESC']],
                })


                const embeddings = new OpenAIEmbeddings({
                    apiKey: api_key,
                    model: process.env.OPEN_AI_EMBEDDING_MODEL,
                    dimensions: 1536
                });
                const embeddedQuery = await embeddings.embedQuery(queryBot.query)
                console.log(queryBot.query, embeddedQuery)
                const similar_data = await this.performSimilaritySearch(embeddedQuery, bot_files)



                const llm = new OpenAI({
                    model: bot?.ai_model,
                    temperature: 0,
                    maxTokens: undefined,
                    timeout: undefined,
                    maxRetries: 2,
                    apiKey: api_key
                });

                console.log(llm)

                const promptTemplate = new PromptTemplate({
                    inputVariables: [
                        'text',
                        'query',
                        'grade',
                        'subject',
                        'chatContext',
                        'master_prompt',
                        'bot_specific_prompt'
                    ],
                    template: `
                        {master_prompt}
                
                        You are an intelligent bot trained to assist students in grade {grade} with expertise in the subject of {subject}. Your goal is to provide accurate, understandable, and grade-appropriate answers. Additionally, format your responses using HTML to enhance readability and presentation. Follow these detailed instructions:
                
                        {bot_specific_prompt}
                
                        IF you find about query in chatContext {chatContext} then do not go for {text}
                         **Understanding Chat Context**:
                            - You have access to the chat context, which includes the previous interactions between the user and you. Use this context to:
                                - Provide relevant, consistent, and coherent answers based on the conversation's history.
                                - Address follow-up questions by referring back to previous interactions when applicable.
                                - Avoid repeating information unnecessarily unless explicitly requested by the user.
                                - Maintain continuity in tone and content to ensure a seamless user experience.
                                - Respond to queries about past interactions accurately, recalling specific details discussed previously.
                                - If the current query revisits or builds on an earlier topic, acknowledge the connection and expand the explanation thoughtfully.
                
                         **Formatting Responses**:
                            - Use \`<p>\` for paragraphs.
                            - Use \`<br>\` for line breaks where needed.
                            - Use \`<b>\` or \`<strong>\` for emphasis.
                            - Use \`<i>\` for italics when explaining concepts or terms.
                            - Use \`<ul>\` and \`<li>\` for lists.
                            - Use \`<sup>\` and \`<sub>\` for mathematical notations.
                            - Use \`<pre>\` or \`<code>\` for code or mathematical derivations to make them stand out.
                
                      
                     **Response Format**:
                            - Return a JSON object with two fields: \`message\` and \`shouldGenerateImage\`.
                            - The \`message\` field should contain the HTML-formatted response.
                            - The \`shouldGenerateImage\` field should be set to \`true\` if the answer requires illustrations or mathematical visuals; otherwise, set it to \`false\`.
                
                     **Enhanced Chat Context Usage**:
                            - Leverage the \`chatContext\` to ensure:
                                - Continuity in follow-up discussions.
                                - Accurate recall of previously discussed topics, ensuring the response is contextually relevant.
                                - Tailored answers that build on prior exchanges, avoiding redundancy.
                            - If a user requests clarification or revisits an earlier topic, provide an enriched explanation without losing alignment with prior responses.
                            - When new information updates or contradicts prior interactions, prioritize the latest query while maintaining coherence with the conversation's flow.
 
                        Respond to the following query using the given chat context:
                        {query}
                    `,
                });


                const pre_messages = chatContext.map((chat) => ({
                    message: chat?.message,
                    isBot: chat?.is_bot
                }





                ))
                const level_data = await Level.findByPk(bot.level_id)
                const chain = promptTemplate.pipe(llm);
                const answer = await chain.invoke({
                    text: similar_data,
                    query: queryBot.query,
                    grade: level_data?.level.toLowerCase(),
                    subject: bot?.name.toLowerCase(),
                    chatContext: pre_messages,
                    bot_specific_prompt: bot?.description,
                    master_prompt: ""
                });

                console.log(answer)

                // const answerMatch = answer.match(/"answer":\s*"([^"]+)"/);
                // const a = answerMatch ? answerMatch[1] : null;

                const answerMatch = answer.match(/"message":\s*"([^"]+)"/);
                const a = answerMatch ? answerMatch[1] : null;

                // Extract the "shouldGenerateImage" value using regular expression
                const shouldGenerateImageMatch = answer.match(/"shouldGenerateImage":\s*(true|false)/);

                const b = shouldGenerateImageMatch ? shouldGenerateImageMatch[1] === 'true' : null; // Extracted boolean value
                console.log("strigify answer", JSON.stringify(a), typeof a)

                console.log("answer", b, typeof b)

                const botRes = await Chat.create({
                    bot_id: queryBot.bot_id,
                    message: a,
                    is_bot: true,
                    image_url: "",
                    user_id: req.user.sub
                });


                return {
                    statusCode: 200,
                    data: botRes,
                    do_generate_image: b

                }
            } else {
                throw new Error('No API key found')
            }



        } catch (error: any) {
            console.log("error", error)
            throw new Error('Error querying bot')
        }
    }



    async performSimilaritySearch(queryVector: number[], bot_files: any[]) {
        const contextDataRecords = await ContextData.findAll({
            attributes: ['id', 'text_chunk', 'embedded_chunk'],
            where: {
                file_id: {
                    [Op.in]: bot_files.map(({ file_id }) => (file_id))
                }
            }
        });

        const similarities = contextDataRecords.map((record) => {
            const embed_data = this.removeCurlyBracesFromArray(record.embedded_chunk)
            // const embeddedVector = JSON.parse(`${record.embedded_chunk}`); // Assuming the embedded_chunk is a stringified array
            const similarity = this.cosineSimilarity(queryVector, embed_data);
            return {
                id: record.id,
                text_chunk: record.text_chunk,
                similarity,
            };
        });

        // Sort by similarity in descending order
        // similarities.sort((a, b) => b.similarity - a.similarity)
        // console.log("similarity", similarities)
        const return_similarities: any = similarities.filter((similar) => similar.similarity >= .5)
        const return_similar_text = return_similarities.map(({ text_chunk }) => (text_chunk + '\n')).join(' ')

        return return_similar_text
    }

    removeCurlyBracesFromArray(input): number[] {
        // Convert the array to a string with curly braces
        const arrayString = `${input}`;

        // Remove the curly braces and convert back to a number array
        return arrayString.replace(/^\{|\}$/g, '').split(',').map(num => parseFloat(num.trim()));
    }

    // Cosine similarity function
    cosineSimilarity(vec1: number[], vec2: number[]): number {
        const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
        const magnitudeVec1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
        const magnitudeVec2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));
        return dotProduct / (magnitudeVec1 * magnitudeVec2);
    }



    async updateBot(updateBotDto: UpdateBotDto, req: any) {
        try {
            await Bot.update({
                name: updateBotDto.name,
                description: updateBotDto.description,
                ai_model: updateBotDto.ai_model,
                level_id: updateBotDto.level_id,
                user_id: req.user.sub,
                subject_id: updateBotDto.subject_id,
                display_name: updateBotDto.display_name
            }, {
                where: {
                    id: {
                        [Op.eq]: updateBotDto.id
                    }
                }
            })
            return {
                statusCode: 200,
                message: "bot updated successfully"
            }
        } catch (error) {
            throw new Error("Error updating bot in DB")
        }
    }

    async createBot(image: Express.Multer.File, createBotDto: CreateBotDto, req: any) {
        console.log(createBotDto)

        try {

            await Bot.create({
                name: createBotDto.name,
                description: createBotDto.description,
                ai_model: createBotDto.ai_model,
                level_id: Number(createBotDto.level_id),
                user_id: req.user.sub,
                bot_image_url: `${image.filename}`,
                // first_message: createBotDto.first_message,
                subject_id: Number(createBotDto.subject_id),
                display_name: createBotDto.display_name
            }).then(async (bot) => {
                await Join_BotContextData.create({
                    bot_id: bot.id,
                    file_id: Number(createBotDto.file_id)
                })
            })
            return {
                statusCode: 200,
                message: "bot created successfully"
            }
        } catch (error) {
            throw new Error("Error creating bot in DB")
        }
    }

    async deleteBot(deleteBotDto: DeleteBotDto) {
        try {

            await Join_BotContextData.destroy({
                where: {
                    bot_id: {
                        [Op.eq]: deleteBotDto.bot_id
                    },
                }
            }).then(async () => {
                await Bot.destroy({
                    where: {
                        id: deleteBotDto.bot_id
                    }
                })
            })

            return {
                statusCode: 200,
                message: "bot DELETED successfully"
            }
        } catch (error) {
            throw new Error("Error deleting bot in DB")
        }
    }



    async getBotContextDto(getBotContextDto: GetBotContextDto) {
        try {
            const data = await Join_BotContextData.findAll({
                where: {
                    bot_id: {
                        [Op.eq]: getBotContextDto.bot_id
                    },
                }
            })
            return {
                statusCode: 200,
                data: data,

            }
        } catch (error) {
            throw new Error("Error getting bot_contextData in DB")
        }
    }


    async deleteJoinBot_ContextData(deleteBotContextDto: DeleteBotContextDto,) {
        try {
            await Join_BotContextData.destroy({
                where: {
                    bot_id: {
                        [Op.eq]: deleteBotContextDto.bot_id
                    },
                    file_id: {
                        [Op.eq]: deleteBotContextDto.file_id
                    },
                }

            })
            return {
                statusCode: 200,
                message: "bot_contextData created successfully"
            }


        } catch (error) {
            throw new Error("Error created bot_contextData in DB")
        }
    }

    async createJoinBot_ContextData(createBotContextDto: CreateBotContextDto) {
        try {
            await Join_BotContextData.create({
                bot_id: createBotContextDto.bot_id,
                file_id: createBotContextDto.file_id
            })
            return {
                statusCode: 200,
                message: "bot_contextData created successfully"
            }


        } catch (error) {
            throw new Error("Error created bot_contextData in DB")
        }
    }


    async updateJoinBot_ContextData(updateJoinBot_Context: UpdateBotContextDto) {
        try {

            await Join_BotContextData.update({
                bot_id: updateJoinBot_Context.bot_id,
                file_id: updateJoinBot_Context.file_id
            }, {
                where: {
                    bot_id: {
                        [Op.eq]: updateJoinBot_Context.bot_id
                    },

                }
            })
            return {
                statusCode: 200,
                message: "bot_contextData updated successfully"
            }
        } catch (error) {
            throw new Error("Error updating bot_contextData in DB")
        }
    }



    async getBotsByLevel(req: any) {
        console.log("user in bot by level", req.user)
        try {
            // Fetch all bots with level
            const bots = await Bot.findAll({
                where: {
                    level_id: {
                        [Op.eq]: req?.user.level_id
                    }
                }
            });

            return {
                statusCode: 200,
                message: "Bots fetched successfully",
                bots: bots, // Include the fetched bots in the response
            };
        } catch (error) {
            this.logger.error("Error fetching bots: ", error.message);
            throw new Error("Error fetching bots from the database");
        }
    }

    async getAllBotsByTeacher(req: any) {
        try {

            const teacher_profile = await TeacherProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            })

            if (teacher_profile) {
                const teacher_data = await JoinTeacherSubjectLevel.findAll({
                    where: {
                        teacher_id: {
                            [Op.eq]: teacher_profile.id
                        }
                    }
                })

                if (teacher_data.length > 0) {
                    const bots = await Bot.findAll({
                        where: {
                            [Op.or]: teacher_data.map(({ subject_id, level_id }) => ({
                                [Op.and]: [
                                    {
                                        subject_id: {
                                            [Op.eq]: subject_id
                                        }
                                    },
                                    {
                                        level_id: {
                                            [Op.eq]: level_id
                                        }
                                    }
                                ]
                            }))
                        }
                    })
                    return {
                        statusCode: 200,
                        data: bots
                    }
                }
            }

        } catch (error) {
            this.logger.error("Error fetching bots: ", error.message);
            throw new Error("Error fetching bots from the database");
        }
    }

    async getAllBotsByAdmin(req: any) {
        try {
            // Fetch all bots with optional associations (e.g., context data)
            const bots = await Bot.findAll({
                where: {
                    user_id: req.user.sub
                }
            });

            return {
                statusCode: 200,
                message: "Bots fetched successfully",
                bots: bots, // Include the fetched bots in the response
            };
        } catch (error) {
            this.logger.error("Error fetching bots: ", error.message);
            throw new Error("Error fetching bots from the database");
        }
    }



    async getBot(getBotDto: GetBotDto) {
        try {
            const bot = await Bot.findByPk(getBotDto?.bot_id)

            return {
                statusCode: 200,
                bot: bot
            }
        } catch (error) {
            throw new Error("enable to get bot")
        }
    }

    async getBotByLevelSubject(getBotByLevelSubject: GetBotByLevelSubject) {
        try {
            const bot = await Bot.findOne({
                where: {
                    subject_id: {
                        [Op.eq]: getBotByLevelSubject.subject_id
                    },
                    level_id: {
                        [Op.eq]: getBotByLevelSubject.level_id
                    },
                }
            })

            return {
                statusCode: 200,
                bot: bot
            }
        } catch (error) {
            throw new Error("enable to get bot by level subject ids")
        }
    }

}
