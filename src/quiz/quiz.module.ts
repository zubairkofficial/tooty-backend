import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz } from './entities/quiz.entity';
import { Level } from '../level/entity/level.entity';
import { Subject } from '../subject/entity/subject.entity';
import { Question } from '../question/entities/question.entity';
import { Option } from '../option/entities/option.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Quiz, Level, Subject, Question, Option]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}