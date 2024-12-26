import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContextDataService } from './contextData.service';
import { CreateFileDto, DeleteFileDto } from './dto/create-contextData.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('context-data')
export class ContextDataController {
    constructor(private readonly contextDataService: ContextDataService) { }


    @Post('upload')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    async processFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileDto: CreateFileDto,
        @Req() req: any,
        @Res() res: any,
    ) {
        if (!file) {
            return { message: 'No file uploaded.' };
        }

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            await this.contextDataService.processFile(file, createFileDto, req, (progress: number) => {
                // Send progress updates
                res.write(`data: ${JSON.stringify({ progress })}\n\n`);
            });

            // Final message after completion
            res.write(`data: ${JSON.stringify({ progress: 100, message: 'Processing complete' })}\n\n`);
            res.end();
        } catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }

    
    @Post('delete')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)

    async deleteFile(@Body() deleteFileDto: DeleteFileDto, @Req() req: any) {

        return this.contextDataService.deleteFile(deleteFileDto, req)

    }

    @Get('files-by-user')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getFiles(@Req() req: any) {
        return this.contextDataService.getAllFilesByUser(req)

    }

}
