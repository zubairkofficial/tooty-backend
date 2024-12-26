import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { UpdateStudentProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { GetStudentProfileDto } from './dto/get-profile.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateJoinTeacherSubjectLevel, DeleteJoinTeacherSubjectLevel, GetJoinsTeacherSubjectLevelDto, GetTeacherProfileDto, UpdateTeacherProfileDto } from './dto/teacher-profile.dto';
import { GetStudentsByLevelDto } from './dto/get-student.dto';
import { UpdateAdminDto } from './dto/admin.dto';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileServices: ProfileService) { }
    //admin management


    @Get('get-admin-profile')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAdminProfile(@Req() req: any) {
        return this.profileServices.getAdminProfile(req)
    }

    @Post('update-admin-profile')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateAdminProfile(@Body() updateAdminProfileDto: UpdateAdminDto, @Req() req: any) {
        return this.profileServices.updateAdmin(updateAdminProfileDto, req)
    }

    //teacher management
    @Post('create-join-teacher-subject-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createJoinTeacherSubjectLevel(@Body() createJoinTeacherSubjectLevelDto: CreateJoinTeacherSubjectLevel, @Req() req: any) {
        return this.profileServices.createJoinTeacherSubjectLevel(createJoinTeacherSubjectLevelDto, req)
    }

    @Post('delete-join-teacher-subject-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteJoinTeacherSubjectLevel(@Body() deleteJoinTeacherSubjectLevelDto: DeleteJoinTeacherSubjectLevel, @Req() req: any) {
        return this.profileServices.deleteJoinTeacherSubjectLevel(deleteJoinTeacherSubjectLevelDto, req)
    }

    @Post('get-join-teacher-subject-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getJoinTeacherSubjectLevel(@Body() getJoinTeacherSubjectLevelDto: GetJoinsTeacherSubjectLevelDto, @Req() req: any) {
        return this.profileServices.getJoinTeacherSubjectLevel(getJoinTeacherSubjectLevelDto, req)
    }


    @Post('fill-teacher-profile')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async fillTeacherProfile(@Body() updateTeacherProfileDto: UpdateTeacherProfileDto, @Req() req: any) {
        return this.profileServices.updateTeacherProfile(updateTeacherProfileDto, req)
    }

    @Post('get-teacher-profile')
    @Roles(Role.ADMIN, Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getTeacherProfile(@Body() getTeacherProfile: GetTeacherProfileDto, @Req() req: any) {
        return this.profileServices.getTeacherProfile(getTeacherProfile, req)
    }


    //students management
    @Post('get-students-by-level')
    @Roles(Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getStudentsByLevel(@Body() getStudentsByLevelDto: GetStudentsByLevelDto, @Req() req: any) {
        return this.profileServices.getStudentsByLevel(getStudentsByLevelDto, req)
    }


    @Post('fill-student-profile')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async fillStudentProfile(@Body() updateProflieDto: UpdateStudentProfileDto, @Req() req: any) {
        return this.profileServices.updateStudentProfile(updateProflieDto, req)
    }

    @Post('get-student-profile')
    @Roles(Role.ADMIN, Role.USER, Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getStudentProfile(@Body() getProfileDto: GetStudentProfileDto, @Req() req: any) {
        return this.profileServices.getStudentProfile(getProfileDto, req)
    }
}
