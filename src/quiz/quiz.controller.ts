// src/controllers/Quiz.controller.ts
import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizService.create(createQuizDto);
  }

  @Get()
  async findAll(): Promise<Quiz[]> {
    return await this.quizService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Quiz> {
    return await this.quizService.findOne(id);
  }
}