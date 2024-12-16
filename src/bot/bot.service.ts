import { Logger } from "@nestjs/common";
import { CreateBotDto, DeleteBotDto, QueryBot } from "./dto/create-bot.dto";
import { Bot } from "./entities/bot.entity";
import { CreateBotContextDto } from "./dto/create-Join-bot-data.dto";
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


            const api = await API.findOne({
                where: {
                    api_name: {
                        [Op.eq]: 'dalle'
                    }
                }
            })




            if (!api) {
                throw new Error("unable to find api key")
            }

            api_key = api?.api_key

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



            const api = await API.findOne({
                where: {
                    api_name: {
                        [Op.eq]: 'open-ai'
                    }
                }
            })



            if (!api) {
                throw new Error("unable to find api key")
            }

            api_key = api?.api_key

            if (api_key != "") {


                const embeddings = new OpenAIEmbeddings({
                    apiKey: api_key,
                    model: process.env.OPEN_AI_EMBEDDING_MODEL,
                    dimensions: 1536
                });
                const embeddedQuery = await embeddings.embedQuery(queryBot.query)
                console.log(queryBot.query, embeddedQuery)
                const similar_data = await this.performSimilaritySearch(embeddedQuery)



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
                    inputVariables: ['text', 'query', 'grade', 'subject'],
                    template: `
                        You are an intelligent bot trained to assist students in grade {grade} with expertise in the subject of {subject}. Your goal is to provide accurate, understandable, and grade-appropriate answers. Follow these detailed instructions:
                
                        1. **Answering Questions Within {subject}**:
                            - If the query is related to {text} or {subject}, answer it in a way that is easy for a grade {grade} student to understand.
                            - Even for advanced topics not typically taught in grade {grade}, simplify your explanation to make it accessible for the student's level.
                
                        2. **Adjusting Answer Length**:
                            - For simple questions: Give a short, direct answer.
                            - For moderately detailed questions: Provide a concise explanation with essential details.
                            - For complex questions: Offer a simplified but thorough explanation suitable for a grade {grade} student.
                
                        3. **Handling Irrelevant Questions**:
                            - If the query is unrelated to {subject}, politely respond:
                              "I'm sorry, but I am trained to answer questions about {subject}. This topic is outside my area of expertise."
                            - Regardless of the query's relevance, always return the response in the following format:
                              - **Answer**: "I am an expert in this subject" (if the query is irrelevant).
                              - **shouldGenerateImage**: false (unless the query specifically asks for an image).
                
                        4. **Maintaining Clarity and Tone**:
                            - Use simple language and examples suitable for a grade {grade} student.
                            - Maintain a friendly, respectful, and encouraging tone.
                
                        5. **Response Format**:
                            - Return a JSON object with two fields: \`answer\` and \`shouldGenerateImage\`.
                            - If the answer requires illustrations, or if the query specifically asks for images/visuals/illustrations, set \`shouldGenerateImage\` to \`true\`.
                            - Otherwise, set \`shouldGenerateImage\` to \`false\`.
                
                        Respond to the following query:
                        {query}
                    `,
                });



                const chain = promptTemplate.pipe(llm);
                const answer = await chain.invoke({
                    text: similar_data,
                    query: queryBot.query,
                    grade: bot?.level,
                    subject: bot?.name
                });

                console.log(answer)

                const answerMatch = answer.match(/"answer":\s*"([^"]+)"/);
                const a = answerMatch ? answerMatch[1] : null;

                // Extract the "shouldGenerateImage" value using regular expression
                const shouldGenerateImageMatch = answer.match(/"shouldGenerateImage":\s*(true|false)/);

                const b = shouldGenerateImageMatch ? shouldGenerateImageMatch[1] === 'true' : null; // Extracted boolean value
                console.log("strigify answer", a, typeof a)

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



    async performSimilaritySearch(queryVector: number[]) {
        const contextDataRecords = await ContextData.findAll({
            attributes: ['id', 'text_chunk', 'embedded_chunk'],
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
    async createBot(createBotDto: CreateBotDto, req: any) {
        console.log(createBotDto)

        try {

            await Bot.create({
                name: createBotDto.name,
                description: createBotDto.description,
                ai_model: createBotDto.ai_model,
                level: createBotDto.level,
                user_id: req.user.sub
            }).then(async (bot) => {
                await Join_BotContextData.create({
                    bot_id: bot.id,
                    file_id: createBotDto.file_id
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
            await Bot.destroy({
                where: {
                    id: deleteBotDto.id
                }
            })

            return {
                statusCode: 200,
                message: "bot DELETED successfully"
            }
        } catch (error) {
            throw new Error("Error deleting bot in DB")
        }
    }


    async joinBot_ContextData(createJoinBot_Context: CreateBotContextDto) {
        try {

            createJoinBot_Context.context_data_id.forEach(async (context_data_id) => {

                await Join_BotContextData.create({
                    bot_id: createJoinBot_Context.bot_id,
                    context_data_id: context_data_id
                })

            });

            return {
                statusCode: 200,
                message: "bot_contextData created successfully"
            }
        } catch (error) {
            throw new Error("Error creating bot_contextData in DB")
        }
    }

    async getBotsByLevel(req: any) {
        console.log("user in bot by level", req.user)
        try {
            // Fetch all bots with level
            const bots = await Bot.findAll({
                where: {
                    level: {
                        [Op.eq]: req?.user.level
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


}
