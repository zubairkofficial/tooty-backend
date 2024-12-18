import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { GetProfileDto } from './dto/get-profile.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('profile')
export class ProfileController {


    constructor(private readonly profileServices: ProfileService) { }
    @Post('fill-profile')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async fillProfile(@Body() updateProflieDto: UpdateProfileDto, @Req() req: any) {
        return this.profileServices.updateProfile(updateProflieDto, req)
    }

    @Post('get-profile')
    @Roles(Role.ADMIN, Role.USER, Role.TEACHER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getProfile(@Body() getProfileDto: GetProfileDto, @Req() req: any) {
        return this.profileServices.getProfile(getProfileDto, req)
    }
}
