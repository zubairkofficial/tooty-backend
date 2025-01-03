// src/dto/CreateQuiz.dto.ts
import { IsNotEmpty, IsEnum, IsDateString, IsInt } from 'class-validator';
import { QuestionDto } from 'src/question/dto/create-question.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(['multiple-choice', 'question-answer'])
  quizType: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsInt()
  duration: number; // Duration in minutes

  @IsNotEmpty()
  levelId: number;

  @IsNotEmpty()
  subjectId: number;

  @IsNotEmpty()
  questions: QuestionDto[];
}