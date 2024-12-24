import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './entity/subject.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SequelizeModule.forFeature([Subject]), ConfigModule],
  controllers: [SubjectController],
  providers: [SubjectService, JwtService]
})
export class SubjectModule {}
