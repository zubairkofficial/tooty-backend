import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { GetProfileDto } from './dto/get-profile.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';

@Controller('profile')
export class ProfileController {


    constructor(private readonly profileServices: ProfileService) { }
    @Post('fill-profile')
    @UseGuards(JwtAuthGuard)
    async fillProfile(@Body() updateProflieDto: UpdateProfileDto, @Req() req: any) {
        return this.profileServices.updateProfile(updateProflieDto, req)
    }

    @Post('get-profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Body() getProfileDto: GetProfileDto, @Req() req: any) {
        return this.profileServices.getProfile(getProfileDto, req)
    }
}
