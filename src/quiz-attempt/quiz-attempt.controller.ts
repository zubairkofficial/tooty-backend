import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizAttemptService } from './quiz-attempt.service';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';
import { UpdateQuizAttemptDto } from './dto/update-quiz-attempt.dto';

@Controller('quiz-attempt')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  @Post()
  create(@Body() createQuizAttemptDto: CreateQuizAttemptDto) {
    return this.quizAttemptService.create(createQuizAttemptDto);
  }

  @Get()
  findAll() {
    return this.quizAttemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizAttemptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizAttemptDto: UpdateQuizAttemptDto) {
    return this.quizAttemptService.update(+id, updateQuizAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizAttemptService.remove(+id);
  }
}
