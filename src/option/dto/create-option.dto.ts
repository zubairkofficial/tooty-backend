// src/dto/Option.dto.ts
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}