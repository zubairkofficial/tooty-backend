// src/dto/Question.dto.ts
import { IsNotEmpty, IsEnum } from 'class-validator';
import { OptionDto } from 'src/option/dto/create-option.dto';

export class QuestionDto {
  @IsNotEmpty()
  text: string;

  @IsEnum(['multiple-choice', 'question-answer'])
  questionType: string;

  @IsNotEmpty()
  options: OptionDto[];
}