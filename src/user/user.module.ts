// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),

    ConfigModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
