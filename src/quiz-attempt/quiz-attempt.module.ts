import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizAttemptService } from './quiz-attempt.service';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttempt } from './entities/quiz-attempt.entity'; // Import your QuizAttempt entity
import { Quiz } from '../quiz/entities/quiz.entity'; // Import other related entities if needed
import { User } from '../user/entities/user.entity'; // Example: Import User entity if needed

@Module({
  imports: [
    SequelizeModule.forFeature([QuizAttempt, Quiz, User]), // Register models with Sequelize
  ],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttemptModule {}