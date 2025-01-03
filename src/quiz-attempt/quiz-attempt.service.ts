import { Injectable } from '@nestjs/common';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';
import { UpdateQuizAttemptDto } from './dto/update-quiz-attempt.dto';

@Injectable()
export class QuizAttemptService {
  create(createQuizAttemptDto: CreateQuizAttemptDto) {
    return 'This action adds a new quizAttempt';
  }

  findAll() {
    return `This action returns all quizAttempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizAttempt`;
  }

  update(id: number, updateQuizAttemptDto: UpdateQuizAttemptDto) {
    return `This action updates a #${id} quizAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizAttempt`;
  }
}
