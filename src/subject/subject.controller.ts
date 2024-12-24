
import { SubjectService } from './subject.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetSubjectDto, UpdateSubjectDto, CreateSubjectDto } from './dto/subject.dto';
@Controller('subject')
export class SubjectController {

    constructor(private readonly subjectServices: SubjectService) { }


    @Post('get-subject')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getSubject(@Body() getSubjectDto: GetSubjectDto, @Req() req: any) {
        return this.subjectServices.getSubject(getSubjectDto, req)
    }

    @Post('get-all-subjects')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllSubjects(@Req() req: any) {
        return this.subjectServices.getAllSubjects(req)
    }

    @Post('update-subject')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateSubject(@Body() updateSubjectDto: UpdateSubjectDto, @Req() req: any) {
        return this.subjectServices.updateSubject(updateSubjectDto, req)
    }

    @Post('create-subject')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createSubject(@Body() createSubjectDto: CreateSubjectDto, @Req() req: any) {
        return this.subjectServices.createSubject(createSubjectDto, req)
    }
}
