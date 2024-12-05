import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ApiController],
  providers: [ApiService, JwtService]
})
export class ApiModule { }
