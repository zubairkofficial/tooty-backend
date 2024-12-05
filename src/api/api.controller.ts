import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AddAPIkeyDto } from './dto/create-api.dto';
import { ApiService } from './api.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('api')
export class ApiController {
    constructor(private readonly apiServices: ApiService) { }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN, Role.USER)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    async addAPIkey(@Body() addAPIkeyDto: AddAPIkeyDto, @Req() req: Request) {
        return this.apiServices.addAPIkey(addAPIkeyDto, req)
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateAPIkey(@Body() addAPIkeyDto: AddAPIkeyDto, @Req() req: Request) {
        return this.apiServices.updateApiKey(addAPIkeyDto, req)
    }
}
