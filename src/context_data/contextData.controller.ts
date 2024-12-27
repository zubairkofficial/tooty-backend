import { Body, Controller, Get, Post, Req, Res, Sse, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContextDataService } from './contextData.service';
import { CreateFileDto, DeleteFileDto } from './dto/create-contextData.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Observable, Subject } from 'rxjs';

@Controller('context-data')
export class ContextDataController {
    private progressSubject = new Subject<{ progress: number, message: any }>();
    constructor(private readonly contextDataService: ContextDataService) { }

    @Post('upload')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileDto: CreateFileDto,
        @Req() req: any,
        @Res() res: any,
    ) {
        if (!file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }
        res.send({ statusCode: 200, message: 'File uploaded successfully. Processing started.' });

        // const userId = req.user.sub;

        this.contextDataService.processFile(file, createFileDto, req, (progress: number) => {
            // Emit progress updates with the user's ID
            this.progressSubject.next({ progress, message: "processing" });
        }).catch((err) => {
            console.error('Error processing file:', err);
            this.progressSubject.next({ progress: 100, message: "err in processing" });
        });
    }

    @Sse('upload-progress')
    uploadProgress(@Req() req: any): Observable<{ data: { progress: number } }> {
        

        return new Observable((observer) => {
            const subscription = this.progressSubject.subscribe({
                next: ({ progress }) => {
                    // if (user === userId) {
                    observer.next({ data: { progress } });
                    // }
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            });

            // Cleanup on disconnection
            return () => subscription.unsubscribe();
        });
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
