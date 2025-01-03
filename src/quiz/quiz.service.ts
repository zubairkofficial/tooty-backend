// src/services/Quiz.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from 'src/subject/entity/subject.entity';
import { Level } from 'src/level/entity/level.entity';
import { Question } from 'src/question/entities/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { Option } from 'src/option/entities/option.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz)
    private readonly quizModel: typeof Quiz,
    @InjectModel(Level)
    private readonly levelModel: typeof Level,
    @InjectModel(Subject)
    private readonly subjectModel: typeof Subject,
    @InjectModel(Question)
    private readonly questionModel: typeof Question,
    @InjectModel(Option)
    private readonly optionModel: typeof Option,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const { title, description, quizType, startTime, endTime, duration, levelId, subjectId, questions } = createQuizDto;

    // Validate quiz timing
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check if level and subject exist
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    const subject = await this.subjectModel.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    // Create the quiz
    const quiz = await this.quizModel.create({
      title,
      description,
      quizType,
      startTime,
      endTime,
      duration,
      levelId,
      subjectId,
    });

    // Add questions and options
    for (const questionDto of questions) {
      const question = await this.questionModel.create({
        text: questionDto.text,
        questionType: questionDto.questionType,
        quizId: quiz.id,
      });

      for (const optionDto of questionDto.options) {
        await this.optionModel.create({
          text: optionDto.text,
          isCorrect: optionDto.isCorrect,
          questionId: question.id,
        });
      }
    }

    return quiz;
  }

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.findAll({
      include: [
        { model: Level, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] },
        { model: Question, include: [Option] },
      ],
    });
  }

  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizModel.findByPk(id, {
      include: [
        { model: Level, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] },
        { model: Question, include: [Option] },
      ],
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    return quiz;
  }
}