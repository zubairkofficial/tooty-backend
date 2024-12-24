import { Module } from '@nestjs/common';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Level } from './entity/level.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SequelizeModule.forFeature([Level]), ConfigModule],
  controllers: [LevelController],
  providers: [LevelService, JwtService]
})
export class LevelModule { }
