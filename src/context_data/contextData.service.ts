import { Logger } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { CreateFileDto, DeleteFileDto } from './dto/create-contextData.dto';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ContextData } from './entities/contextData.entity';
import { File } from './entities/file.entity';
import { Op } from 'sequelize';
import { Request } from 'express';
import { API } from 'src/api/entities/api.entity';
import { Bot } from 'src/bot/entities/bot.entity';
import { Join_BotContextData } from 'src/bot/entities/join_botContextData.entity';
import { AdminProfile } from 'src/profile/entities/admin-profile.entity';

interface Chunk {
    id: number;
    data: string;
}

export class ContextDataService {
    constructor(
        private readonly logger = new Logger()) { }

    async getAllFilesByUser(req: any) {
        console.log(req.user.sub)
        try {

            const files = await File.findAll(
                //     {
                //     where: {
                //         user_id: {
                //             [Op.eq]: req.user.sub
                //         }
                //     }
                // }
            )

            return {
                statusCode: 200,
                files: files,
                message: "success getting files"
            }
        } catch (error) {
            throw new Error('error fetching file')
        }
    }
    async deleteFile(deleteFileDto: DeleteFileDto, req: Request) {
        try {
            const res = await File.destroy({
                where: {
                    id: {
                        [Op.eq]: deleteFileDto.id
                    }
                }
            }).then(async () => {
                await ContextData.destroy({
                    where: {
                        file_id: {
                            [Op.eq]: deleteFileDto.id
                        }
                    }
                })

                await Join_BotContextData.update({
                    file_id: null
                }, {
                    where: {
                        file_id: {
                            [Op.eq]: deleteFileDto.id
                        }
                    }
                })

            }).then(result => {
                console.log("sucees",);

                return {
                    statusCode: 200,
                    message: "File and Context data deleted successfully"
                }
            })


            return res
        } catch (error) {
            throw new Error('Failed Deleting File')
        }
    }

    async processFile(
        file: Express.Multer.File,
        createFileDto: CreateFileDto,
        req: any,
        onProgress: (progress: number) => void,
    ) {
        console.log('req user:', req.user);
        console.log('File received:', file.originalname, createFileDto.file_name);

        if (!file.originalname.endsWith('.pdf')) {
            throw new Error('Only PDF files are supported');
        }

        const api = await AdminProfile.findOne({
            attributes: ['openai']
        });
        if (!api) {
            throw new Error('Unable to find API key');
        }

        const api_key = api.openai;

        if (api_key) {
            const context_file = await File.create({
                file_name: createFileDto.file_name,
                slug: createFileDto.slug,
                user_id: req.user.sub,
            });

            const parentDoc = await pdf(file.buffer);
            const subDocs = this.splitTextIntoChunks(parentDoc.text, 1000, 20);

            const embeddings = new OpenAIEmbeddings({
                apiKey: api_key,
                model: process.env.OPEN_AI_EMBEDDING_MODEL,
                dimensions: 1536,
            });

            try {
                const totalChunks = subDocs.length;
                let processedChunks = 0;

                const promises = subDocs.map(async ({ data }) => {
                    const embeddedData = await embeddings.embedQuery(data);
                    console.log('This is embedded data:', embeddedData);

                    await ContextData.create({
                        text_chunk: data,
                        embedded_chunk: `{${embeddedData}}`,
                        file_id: context_file.id,
                    });
                    // Update progress
                    processedChunks++;
                    const progress = Math.round((processedChunks / totalChunks) * 100);
                    onProgress(progress);
                });

                await Promise.all(promises);



            } catch (error) {
                console.error('Error generating embedding:', error);
                throw new Error('Error creating context data');
            }
        }
    }


    splitTextIntoChunks(text: string, chunkSize: number, overlap: number): Chunk[] {
        if (chunkSize <= 0) {
            throw new Error('Chunk size must be greater than 0.');
        }
        if (overlap < 0) {
            throw new Error('Overlap must be 0 or a positive number.');
        }

        const chunks: Chunk[] = [];
        let start = 0;
        let id = 0;

        while (start < text.length) {
            const end = start + chunkSize;
            const chunkText = text.slice(start, end);

            chunks.push({
                id: id++,
                data: chunkText,
            });

            // Adjust the start position for overlap
            start += chunkSize - overlap;

            // Prevent infinite loop in case of overlap greater than chunkSize
            if (start < 0) {
                throw new Error('Overlap cannot be greater than or equal to chunk size.');
            }
        }

        return chunks;
    }

    // private async parsePdf(buffer: Buffer): Promise<string> {
    //     try {
    //         const data = await pdf(buffer);
    //         return data.text;
    //     } catch (error) {
    //         console.error('Error parsing PDF:', error);
    //         throw new Error('Failed to parse the PDF file');
    //     }
    // }

}
