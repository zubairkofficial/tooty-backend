import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { ApiService } from './api.service';
// import { Roles } from 'src/decorators/roles.decorator';
// import { Role } from 'src/utils/roles.enum';


import { UpdateApiKeyDto } from './dto/update-api.dto';
import { JwtAuthGuard } from 'src/guards/jwtVerifyAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
// import { RolesGuard } from 'src/guards/roles.guard';

@Controller('api')
export class ApiController {
    constructor(private readonly apiServices: ApiService) { }


    @Get('get-deepgram-api')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)

    async getDeepGramAapi(@Req() req: any) {
        return this.apiServices.getDeepGramApi(req)
    }

    //get All api key against admin
    @Get('get-all-apis')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.ADMIN, Role.USER)
    async getAllApiKeys(@Req() req: any) {
        return this.apiServices.getAllApiKeys(req)
    }

    // @Post('getApiKey')
    // @UseGuards(JwtAuthGuard)
    // // @Roles(Role.ADMIN, Role.USER)
    // async getApiKey(@Body() addAPIkeyDto: AddAPIkeyDto, @Req() req: any) {
    //     return this.apiServices.addAPIkey(addAPIkeyDto, req)
    // }

    // @Post('add')
    // @UseGuards(JwtAuthGuard)
    // // @Roles(Role.ADMIN, Role.USER)
    // async addAPIkey(@Body() addAPIkeyDto: AddAPIkeyDto, @Req() req: any) {
    //     return this.apiServices.addAPIkey(addAPIkeyDto, req)
    // }

    @Post('update')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateAPIkey(@Body() updateApiKeyDto: UpdateApiKeyDto, @Req() req: any) {
        return this.apiServices.updateApiKey(updateApiKeyDto, req)
    }

    // @Post('delete')
    // @UseGuards(JwtAuthGuard)
    // async deleteApiKey(@Body() deleteApiKeyDto: DeleteApiKeyDto, @Req() req: any) {
    //     return this.apiServices.deleteApiKey(deleteApiKeyDto, req)
    // }
}
