import { Logger } from "@nestjs/common";
import { CreateBotDto, DeleteBotDto, QueryBot } from "./dto/create-bot.dto";
import { Bot } from "./entities/bot.entity";
import { CreateBotContextDto } from "./dto/create-Join-bot-data.dto";
import { Join_BotContextData } from "./entities/join_botContextData.entity";
import { ContextData } from "src/context_data/entities/contextData.entity";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Request } from "express";
import sequelize from "sequelize";
import { Sequelize } from "sequelize-typescript";


export class BotService {

    constructor(private readonly logger = new Logger('BotService'), private readonly sequelize: Sequelize,) { }



    async queryBot(queryBot: QueryBot) {
        const openAPIKey = process.env.OPEN_AI_API
        try {
            // const bot = await Bot.findByPk(queryBot.bot_id, {
            //     include: ['ai_model']
            // })
            const bot = undefined

            const embeddings = new OpenAIEmbeddings({
                apiKey: openAPIKey,
                model: process.env.OPEN_AI_EMBEDDING_MODEL,
                dimensions: 1536
            });
            const embeddedQuery = await embeddings.embedQuery(queryBot.query)
            console.log(queryBot.query, embeddedQuery)
            const similar_data = await this.performSimilaritySearch(embeddedQuery)

            const model: string = bot ? bot.ai_model : "gpt-3.5-turbo-instruct" //for development

            const llm = new OpenAI({
                model: model,
                temperature: 0,
                maxTokens: undefined,
                timeout: undefined,
                maxRetries: 2,
                apiKey: openAPIKey
            });

            console.log(llm)

            const promptTemplate = new PromptTemplate({
                inputVariables: ['text', 'query'],
                template: `
                  Given the following text: {text}
                  Answer the following query: {query}
                `,
            });

            const chain = promptTemplate.pipe(llm);
            const answer = await chain.invoke({
                text: similar_data,
                query: queryBot.query
            });

            console.log("answer", answer)
            return {
                statusCode: 200,
                answer: answer
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
            // const embeddedVector = JSON.parse(`${record.embedded_chunk}`); // Assuming the embedded_chunk is a stringified array
            const similarity = this.cosineSimilarity(queryVector, record.embedded_chunk);
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

}
