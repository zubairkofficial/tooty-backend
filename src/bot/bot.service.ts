import { Logger } from "@nestjs/common";
import { CreateBotDto, DeleteBotDto, GetBotByLevelSubject, GetBotBySubjectDto, GetBotDto, QueryBot, UpdateBotDto } from "./dto/create-bot.dto";
import { Bot } from "./entities/bot.entity";
import { CreateBotContextDto, DeleteBotContextDto, GetBotContextDto, UpdateBotContextDto } from "./dto/create-Join-bot-data.dto";
import { Join_BotContextData } from "./entities/join_botContextData.entity";
import { ContextData } from "src/context_data/entities/contextData.entity";
import { OpenAIEmbeddings, OpenAI, DallEAPIWrapper, ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";

import { pull } from "langchain/hub";
import { Annotation, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createRetrievalChain } from "langchain/chains/retrieval";
import { tool } from "@langchain/core/tools";




import { query, Request } from "express";
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
import { error } from "console";
import * as similarity from 'cosine-similarity'
import { PoolConfig } from "pg";
import { DistanceStrategy, PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { AIMessage, BaseMessage, HumanMessage, isAIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { measureMemory } from "vm";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const retrieveSchema = z.object({ query: z.string() });

const outputSchema = z.object({
    answer: z.string().describe(`The answer to the query,   **Response Formatting**:
                        - Use HTML tags for better presentation:
                            - \`<p>\` for paragraphs.
                            - \`<br>\` for line breaks.
                            - \`<b>\` or \`<strong>\` for emphasis.
                            - \`<i>\` for italics when explaining concepts.
                            - \`<ul>\` and \`<li>\` for lists.
                            - \`<sup>\` and \`<sub>\` for mathematical notations.
                            - \`<pre>\` or \`<code>\` for code or mathematical derivations.
                        - Do not include \`<img>\` tags in the response.
                        - Break long lines for better readability.  `),
    shouldGenerateImage: z.boolean().describe("Based on the query and answer: Whether an image should be generated"),

});

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
        console.log("Data from message:", queryBot);
        let api_key = "";





        try {
            // Fetch the bot by ID
            const bot = await Bot.findByPk(queryBot.bot_id);
            console.log("Bot in bot:", bot);

            if (!bot) {
                throw new Error("No bot with this ID exists.");
            }

            // Fetch files associated with the bot
            const bot_files = await Join_BotContextData.findAll({
                attributes: ["file_id"],
                where: {
                    bot_id: {
                        [Op.eq]: bot.id,
                    },
                },
            });

            if (bot_files.length === 0) {
                throw new Error("No files are attached to this bot.");
            }

            // Fetch the API key from the admin profile
            const api = await AdminProfile.findOne({
                attributes: ["openai", "master_prompt"],
            });

            if (!api) {
                throw new Error("Unable to find API key.");
            }

            api_key = api?.openai;

            if (api_key !== "") {
                // Fetch chat context for the user and bot
                const chatContext = await Chat.findAll({
                    attributes: ["message", "is_bot"],
                    where: {
                        bot_id: {
                            [Op.eq]: queryBot.bot_id,
                        },
                        user_id: {
                            [Op.eq]: req.user?.sub,
                        },
                    },
                    limit: Number(process?.env?.CONTEXT_MESSAGES_LIMIT) ?? 5,
                    order: [["createdAt", "DESC"]],
                });

                // Generate embeddings for the query
                const embeddings = new OpenAIEmbeddings({
                    apiKey: api_key,
                    model: process.env.OPEN_AI_EMBEDDING_MODEL,
                    dimensions: 1536,
                });
                const embeddedQuery = await embeddings.embedQuery(queryBot.query);
                console.log("Query:", queryBot.query, "Embedded Query:", embeddedQuery);


                // 4. Connect to PgVectorStore
                // Initialize Sequelize
                // Sample config
                const config = {
                    postgresConnectionOptions: {
                        type: "postgres",
                        host: `${process.env.DB_HOST}`,

                        password: `${process.env.DB_PASSWORD}`,
                        database: `${process.env.DB_NAME}`,

                        port: Number(`${process.env.DB_PORT}`),
                        user: `${process.env.DB_USERNAME}`,

                    } as PoolConfig,
                    tableName: "vector_data",
                    columns: {
                        idColumnName: "id",
                        vectorColumnName: "vector",
                        contentColumnName: "content",
                        metadataColumnName: "metadata",
                    },
                    // supported distance strategies: cosine (default), innerProduct, or euclidean
                    distanceStrategy: "cosine" as DistanceStrategy,
                };

                const vectorStore = await PGVectorStore.initialize(embeddings, config);

                const checkpointer = PostgresSaver.fromConnString(
                    `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
                );

                await checkpointer.setup();

                // const graph = createReactAgent({
                //     tools: [getWeather],
                //     llm: new ChatOpenAI({
                //       model: "gpt-4o-mini",
                //     }),
                //     checkpointSaver: checkpointer,
                //   });
                //   const config = { configurable: { thread_id: "1" } };

                /////////////////
                const retrieve = tool(
                    async ({ query }) => {
                        const retrievedDocs = await vectorStore.similaritySearch(query, 2);
                        const serialized = retrievedDocs
                            .map(
                                (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
                            )
                            .join("\n");
                        return [serialized, retrievedDocs];
                    },
                    {
                        name: "retrieve",
                        description: "Retrieve information related to a query.",
                        schema: retrieveSchema,
                        responseFormat: "content_and_artifact",
                    }
                );


                ////////////////

                const system_prompt = `    
                        **Bot Specific Prompt**
                        ${bot?.description}

                        **Response Formatting**:
                        - Use HTML tags for better presentation:
                            - \`<p>\` for paragraphs.
                            - \`<br>\` for line breaks.
                            - \`<b>\` or \`<strong>\` for emphasis.
                            - \`<i>\` for italics when explaining concepts.
                            - \`<ul>\` and \`<li>\` for lists.
                            - \`<sup>\` and \`<sub>\` for mathematical notations.
                            - \`<pre>\` or \`<code>\` for code or mathematical derivations.
                        - Do not include \`<img>\` tags in the response.
                        - Break long lines for better readability.
                `


                // Step 1: Generate an AIMessage that may include a tool-call to be sent.
                async function queryOrRespond(state: typeof MessagesAnnotation.State) {
                    const llmWithTools = llm.bindTools([retrieve]);
                    const response = await llmWithTools.invoke(state.messages);
                    // MessagesState appends messages to state instead of overwriting
                    return { messages: [response] };
                }

                // Step 2: Execute the retrieval.
                const tools = new ToolNode([retrieve]);

                // Step 3: Generate a response using the retrieved content.
                async function generate(state: typeof MessagesAnnotation.State) {
                    // Get generated ToolMessages
                    let recentToolMessages = [];
                    for (let i = state["messages"].length - 1; i >= 0; i--) {
                        let message = state["messages"][i];
                        if (message instanceof ToolMessage) {
                            recentToolMessages.push(message);
                        } else {
                            break;
                        }
                    }
                    let toolMessages = recentToolMessages.reverse();

                    // Format into prompt
                    const docsContent = toolMessages.map((doc) => doc.content).join("\n");

                    const systemMessageContent =
                        system_prompt +
                        "\n\n **Context**" +
                        `${docsContent}`;

                    const conversationMessages = state.messages.filter(
                        (message) =>
                            message instanceof HumanMessage ||
                            message instanceof SystemMessage ||
                            (message instanceof AIMessage && message.tool_calls.length == 0)
                    );
                    const prompt = [
                        new SystemMessage(systemMessageContent),
                        ...conversationMessages,
                    ];

                    // Run
                    const response = await llm.invoke(prompt);

                    return { messages: [response] };
                }

                const graphBuilder = new StateGraph(MessagesAnnotation)
                    .addNode("queryOrRespond", queryOrRespond)
                    .addNode("tools", tools)
                    .addNode("generate", generate)
                    .addEdge("__start__", "queryOrRespond")
                    .addConditionalEdges("queryOrRespond", toolsCondition, {
                        __end__: "__end__",
                        tools: "tools",
                    })
                    .addEdge("tools", "generate")
                    .addEdge("generate", "__end__");

                const graph = graphBuilder.compile({ checkpointer: checkpointer });



                // Initialize the OpenAI model
                const llm = new ChatOpenAI({
                    model: bot?.ai_model || "gpt-3.5-turbo",
                    temperature: 0,
                    maxTokens: 1000,
                    timeout: 15000,
                    maxRetries: 2,
                    apiKey: api_key,
                });

                // const llm_structured = llm.bindTools([outputSchema])


                let thredConfig = { configurable: { thread_id: `${queryBot.bot_id}-${req.user.sub}` } };

                const extractAnswer = (res) => {

                    for (const step of res.messages.reverse()) {


                        const answer = extractAnswerContent(step);
                        if (answer == "") {
                            continue
                        } else if (answer != "") {
                            return answer
                        }

                    }
                }
                const extractAnswerContent = (message: BaseMessage) => {

                    let txt;
                    if (isAIMessage(message) && message.tool_calls.length == 0) {

                        txt = message.content
                        return txt
                    }
                    return ""
                };



                let input = {
                    messages: [{ role: "user", content: queryBot.query }],
                };

                const response = await graph.invoke(input, thredConfig)
                console.log("response", response)
                const answer = extractAnswer(response)

                console.log("extractANSWER", answer)
                const template = `
                    You are a model that analyzes queries and their associated answers to determine if generating an image based on the information is feasible. 
                   
                    query:
                    {query}

                    Answer: 
                    {answer}

                    **Expected Output JSON**
                    {{
                    "shouldGenerateImage" : "boolean"
                    }}

                    
                    
                  `
                const imageGenrateTemplate = ChatPromptTemplate.fromMessages([
                    ["system", template],
                ]);

                const promptValue = await imageGenrateTemplate.invoke({
                    query: queryBot.query,
                    answer: answer
                });

                const shouldGenerateImageRes = await llm.invoke(promptValue)
                const imageGeneration = JSON.parse(`${shouldGenerateImageRes.content}`)




                if (answer !== "" && imageGeneration != undefined) {
                    // Save the bot's response to the chat
                    const botRes = await Chat.create({
                        bot_id: queryBot.bot_id,
                        message: answer,
                        is_bot: true,
                        image_url: "",
                        user_id: req.user.sub,
                    });

                    return {
                        statusCode: 200,
                        data: botRes,
                        do_generate_image: imageGeneration?.shouldGenerateImage
                    };
                } else {
                    throw new Error("An error occurred while generating the response.");
                }
            } else {
                throw new Error("No API key found.");
            }
        } catch (error: any) {
            console.log("Error:", error);
            throw new Error("Error querying bot: " + error.message);
        }
    }



    // async performSimilaritySearch(queryVector: number[], bot_files: any[]) {
    //     const contextDataRecords = await ContextData.findAll({
    //         attributes: ['id', 'text_chunk', 'embedded_chunk'],
    //         where: {
    //             file_id: {
    //                 [Op.in]: bot_files.map(({ file_id }) => (file_id))
    //             }
    //         }
    //     });

    //     const similarities = contextDataRecords.map((record) => {
    //         const embed_data = this.removeCurlyBracesFromArray(record.embedded_chunk)
    //         // const embeddedVector = JSON.parse(`${record.embedded_chunk}`); // Assuming the embedded_chunk is a stringified array
    //         const similarity = this.cosineSimilarity(queryVector, embed_data);
    //         return {
    //             id: record.id,
    //             text_chunk: record.text_chunk,
    //             similarity,
    //         };
    //     });

    //     // Sort by similarity in descending order
    //     // similarities.sort((a, b) => b.similarity - a.similarity)
    //     // console.log("similarity", similarities)
    //     const return_similarities: any = similarities.filter((similar) => similar.similarity >= .7)
    //     const return_similar_text = return_similarities.map(({ text_chunk }) => (text_chunk + '\n')).join(' ')

    //     return return_similar_text
    // }

    // removeCurlyBracesFromArray(input): number[] {
    //     // Convert the array to a string with curly braces
    //     const arrayString = `${input}`;

    //     // Remove the curly braces and convert back to a number array
    //     return arrayString.replace(/^\{|\}$/g, '').split(',').map(num => parseFloat(num.trim()));
    // }

    // // Cosine similarity function
    // cosineSimilarity(vec1: number[], vec2: number[]): number {
    //     if (!vec1.length || !vec2.length) {
    //         throw new Error("Vectors cannot be empty");
    //     }

    //     if (vec1.length !== vec2.length) {
    //         throw new Error("Vectors must have equal length");
    //     }

    //     // const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    //     // const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    //     // const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    //     // if (mag1 === 0 || mag2 === 0) {
    //     //     throw new Error("Vector magnitudes cannot be zero");
    //     // }

    //     // return dotProduct / (mag1 * mag2);

    //     const check_similarity = similarity(vec1, vec2);
    //     if (!check_similarity) {
    //         return 0
    //     }
    //     return check_similarity
    // }




    async updateBot(updateBotDto: UpdateBotDto, req: any) {
        try {
            await Bot.update({
                name: updateBotDto.name,
                description: updateBotDto.description,
                ai_model: updateBotDto.ai_model,
                level_id: updateBotDto.level_id,
                user_id: req.user.sub,
                subject_id: updateBotDto.subject_id,
                display_name: updateBotDto.display_name,
                voice_model: updateBotDto.voice_model
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
            const bot_already_exist = await Bot.findOne({
                where: {
                    level_id: {
                        [Op.eq]: createBotDto.level_id
                    },
                    subject_id: {
                        [Op.eq]: createBotDto.subject_id
                    },
                }
            })
            if (bot_already_exist) {
                throw new Error("Bot with level and subject already exist")
            }
            await Bot.create({
                name: createBotDto.name,
                description: createBotDto.description,
                ai_model: createBotDto.ai_model,
                level_id: Number(createBotDto.level_id),
                user_id: req.user.sub,
                bot_image_url: `${image.filename}`,
                voice_model: createBotDto.voice_model,
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

    async getAllBotsByTeacher(req: any, page: number = 1, limit: number = 10) {
        try {
            // Calculate the offset based on the page and limit
            const offset = (page - 1) * limit;

            // Fetch the teacher's profile
            const teacher_profile = await TeacherProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub,
                    },
                },
            });

            if (!teacher_profile) {
                throw new Error("Teacher profile not found");
            }

            // Fetch the teacher's subject and level data
            const teacher_data = await JoinTeacherSubjectLevel.findAll({
                where: {
                    teacher_id: {
                        [Op.eq]: teacher_profile.id,
                    },
                },
            });

            if (teacher_data.length === 0) {
                throw new Error("No subjects or levels assigned to the teacher");
            }

            // Fetch paginated bots based on the teacher's subjects and levels
            const { rows: bots, count: total } = await Bot.findAndCountAll({
                where: {
                    [Op.or]: teacher_data.map(({ subject_id, level_id }) => ({
                        [Op.and]: [
                            {
                                subject_id: {
                                    [Op.eq]: subject_id,
                                },
                            },
                            {
                                level_id: {
                                    [Op.eq]: level_id,
                                },
                            },
                        ],
                    })),
                },
                limit, // Number of records to fetch
                offset, // Starting point for the records
                order: [['createdAt', 'DESC']], // Optional: Sort by creation date
            });

            // Calculate the total number of pages
            const totalPages = Math.ceil(total / limit);

            return {
                statusCode: 200,
                message: "Bots fetched successfully",
                bots, // Paginated bots
                total, // Total number of bots
                page, // Current page
                totalPages, // Total number of pages
            };
        } catch (error) {
            this.logger.error("Error fetching bots: ", error.message);
            throw new Error("Error fetching bots from the database");
        }
    }
    async getAllBotsByAdmin(req: any, page: number = 1, limit: number = 10) {
        try {
            // Calculate the offset based on the page and limit
            const offset = (page - 1) * limit;

            // Fetch paginated data from the database
            const { rows: bots, count: total } = await Bot.findAndCountAll({
                where: {
                    user_id: req.user.sub, // Filter by admin's user ID
                },
                limit, // Number of records to fetch
                offset, // Starting point for the records
                order: [['createdAt', 'DESC']], // Optional: Sort by creation date
            });

            // Calculate the total number of pages
            const totalPages = Math.ceil(total / limit);

            return {
                statusCode: 200,
                message: "Bots fetched successfully",
                bots, // Paginated bots
                total, // Total number of bots
                page, // Current page
                totalPages, // Total number of pages
            };
        } catch (error) {
            this.logger.error("Error fetching bots: ", error.message);
            throw new Error("Error fetching bots from the database");
        }
    }


    async getBotBySubject(getBotDto: GetBotBySubjectDto, req: any) {
        try {

            const data = await TeacherProfile.findOne({
                where: {
                    user_id: {
                        [Op.eq]: req.user.sub
                    }
                }
            }).then(async (teacher) => {
                const bot = await Bot.findOne({
                    where: {
                        subject_id: {
                            [Op.eq]: getBotDto?.subject_id
                        },
                        level_id: {
                            [Op.eq]: teacher.level_id
                        }
                    }
                })
                return bot
            })


            return {
                statusCode: 200,
                bot: data
            }
        } catch (error) {
            throw new Error("enable to get bot")
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
