import { Logger } from '@nestjs/common';
import * as pdf from 'pdf-parse';
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CreateFileDto } from './dto/create-contextData.dto';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ContextData } from './entities/contextData.entity';
import { File } from './entities/file.entity';

interface Chunk {
    id: number;
    data: string;
}

export class ContextDataService {
    constructor(
        private readonly logger = new Logger()) { }
    async processFile(file: Express.Multer.File, createFileDto: CreateFileDto) {

        console.log('File received:', file.originalname, createFileDto.file_name);

        if (!file.originalname.endsWith('.pdf')) {
            throw new Error('Only PDF files are supported');
        }

        const context_file = await File.create({
            file_name: createFileDto.file_name,
            slug: createFileDto.slug
        })

        const parentDoc = await pdf(file.buffer)
        console.log(parentDoc)


        const subDocs = this.splitTextIntoChunks(parentDoc.text, 1000, 20);

        console.log(subDocs)
        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPEN_AI_API,
            model: process.env.OPEN_AI_EMBEDDING_MODEL,
            dimensions: 1536
        });

        try {
            subDocs.forEach(async ({ data }) => {
                let embedded_data = await embeddings.embedQuery(data);
                console.log("ehis is embeded data", embedded_data)
                const result = await ContextData.create({
                    text_chunk: data,
                    embedded_chunk: `{${embedded_data}}`,
                    file_id: context_file.id
                })
                console.log("result", result)
            })

            return {
                statusCode: 200,
                message: "Successs creating context data"
            }
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('error creating context data')
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
