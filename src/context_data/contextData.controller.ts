import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContextDataService } from './contextData.service';
import { CreateFileDto } from './dto/create-contextData.dto';

@Controller('context-data')
export class ContextDataController {
    constructor(private readonly contextDataService: ContextDataService) { }


    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    async processFile(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
        if (!file) {
            return { message: 'No file uploaded.' };
        }

        return this.contextDataService.processFile(file, createFileDto)
        
    }


}
