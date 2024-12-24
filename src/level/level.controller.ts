import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LevelService } from './level.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateLevelDto, GetLevelDto, UpdateLevelDto } from './dto/level.dto';

@Controller('level')
export class LevelController {

    constructor(private readonly levelServices: LevelService) { }

    @Post('get-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getLevel(@Body() getLevelDto: GetLevelDto, @Req() req: any) {
        return this.levelServices.getLevel(getLevelDto, req)
    }

    @Post('get-all-levels')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllLevels(@Req() req: any) {
        return this.levelServices.getAllLevels(req)
    }

    @Post('update-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateLevel(@Body() updateLevelDto: UpdateLevelDto, @Req() req: any) {
        return this.levelServices.updateLevel(updateLevelDto, req)
    }

    @Post('create-level')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createLevel(@Body() createLevelDto: CreateLevelDto, @Req() req: any) {
        return this.levelServices.createLevel(createLevelDto, req)
    }

}
